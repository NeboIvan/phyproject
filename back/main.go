package main

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

var salt string
var refsalt string

type User struct {
	ID        uint   `json:"id"`
	FirstName string `json:"firstname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Score     int    `json:"score"`
}
type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}
type TokenBase struct {
	AccessUuid string        `json:"accessuuid"`
	UserId     string        `json:"userid"`
	DurTime    time.Duration `json:"durtime"`
}

type Question struct {
	ID       uint `json:"id"`
	OwnerID  uint
	Name     string `json:"name"`
	UserName string `json:"username"`
	Question string `json:"question"`
	Options  string `json:"options"`
	Date     string `json:"date"`
	Answer   int    `json:"ans"`
}

// type ImgQuestion struct {
// 	ImgSrc   string `json:"imgsrc"`
// 	ID       uint   `json:"id"`
// 	Question string `json:"question"`
// 	Count    int    `integer:"count"`
// 	Options  string `json:"options"`
// 	Answer   string `json:"ans"`
// }
// type FullImgQuestion struct {
// 	ImgSrc   string `json:"imgsrc"`
// 	ID       uint   `json:"id"`
// 	Question string `json:"question"`
// 	Count    int    `integer:"count"`
// 	UserAns  string `json:"userans"`
// 	Answer   string `json:"ans"`
// }
// type FullQuestion struct {
// 	ID       uint   `json:"id"`
// 	Question string `json:"question"`
// 	Count    int    `integer:"count"`
// 	UserAns  string `json:"userans"`
// 	Answer   string `json:"ans"`
// }
// type Quiz struct {
// 	ID        uint   `json:"id"`
// 	Question1 string `json:"question1"`
// 	Answer1   string `json:"ans1"`
// 	Question2 string `json:"question2"`
// 	Answer2   string `json:"ans2"`
// 	Question3 string `json:"question3"`
// 	Answer3   string `json:"ans3"`
// 	Question4 string `json:"question4"`
// 	Answer4   string `json:"ans4"`
// 	Question5 string `json:"question5"`
// 	Answer5   string `json:"ans5"`
// }

func main() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PORT"))
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
	}
	fff, _ := db.DB()
	defer fff.Close()
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Question{})
	// db.AutoMigrate(&Quiz{})
	// db.AutoMigrate(&FullQuestion{})
	// db.AutoMigrate(&FullImgQuestion{})
	// db.AutoMigrate(&ImgQuestion{})
	db.AutoMigrate(&TokenBase{})

	r := gin.Default()
	r.GET("/q", GetQuestions)
	//  /favicon.ico
	r.GET("/q/:id", GetQuestion)
	r.POST("/newq", CreateQuestion)
	r.DELETE("/delq/:id", DeleteQestion)

	r.POST("/newuser", CreateUser)
	r.GET("/getuser/:id", GetUserByIdHandle)
	r.POST("/login", Login)

	// r.GET("/g1/", GetG1)
	// r.GET("/g1/:id", GetG1s)
	// r.POST("/g1", CreateG1)
	// r.DELETE("/g1/:id", DeleteG1)

	r.Use((cors.Default()))
	r.Run(":8080")
}

func Login(c *gin.Context) {
	var u User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
		return
	}
	user := GetUserByName(u.FirstName)
	if user.Password != u.Password {
		c.JSON(http.StatusUnauthorized, "Please provide valid login details")
		return
	}
	ts, err := CreateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	saveErr := CreateAuth(user.ID, ts)
	if saveErr != nil {
		c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
	}
	tokens := map[string]string{
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	c.JSON(http.StatusOK, tokens)
}
func CreateToken(userid uint) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUuid = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Hour * 12).Unix()
	td.RefreshUuid = uuid.NewV4().String()

	var err error
	//Creating Access Token
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims["user_id"] = userid
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(salt))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["user_id"] = userid
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(refsalt))
	if err != nil {
		return nil, err
	}
	return td, nil
}
func CreateAuth(userid uint, td *TokenDetails) error {
	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()
	tbase := TokenBase{td.AccessUuid, strconv.Itoa(int(userid)), at.Sub(now)}
	errAccess := db.Create(&tbase).Error
	if errAccess != nil {
		return errAccess
	}
	tbaseref := TokenBase{td.RefreshUuid, strconv.Itoa(int(userid)), rt.Sub(now)}
	errRefresh := db.Create(&tbaseref).Error
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}

func ExtractToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")
	//normally Authorization the_token_xxx
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}
func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(salt), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}
func TokenValid(r *http.Request) error {
	token, err := VerifyToken(r)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid { //// Warning
		return errors.New("Wrong Key") ////  Warning
	}
	return nil
}

type AccessDetails struct {
	AccessUuid string
	UserId     uint
}

func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}
		userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 32)
		if err != nil {
			return nil, err
		}
		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:     uint(userId),
		}, nil
	}
	return nil, err
}

func FetchAuth(authD *AccessDetails) (uint, error) {
	var userid string
	err := db.Where("accessuuid = ?", authD.AccessUuid).First(&userid).Error
	if err != nil {
		return 0, err
	}
	userID, _ := strconv.ParseUint(userid, 10, 32)
	return uint(userID), nil
}

// Template for auth-need function

// func CreateTodo(c *gin.Context) {
// 	var td *Todo
// 	if err := c.ShouldBindJSON(&td); err != nil {
// 		c.JSON(http.StatusUnprocessableEntity, "invalid json")
// 		return
// 	}
// 	tokenAuth, err := ExtractTokenMetadata(c.Request)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, "unauthorized")
// 		return
// 	}
// 	userId, err = FetchAuth(tokenAuth)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, "unauthorized")
// 		return
// 	}
// 	td.UserID = userId

// 	//you can proceed to save the Todo to a database
// 	//but we will just return it to the caller here:
// 	c.JSON(http.StatusCreated, td)
// }

// Qestions
func GetQuestion(c *gin.Context) {
	id := c.Params.ByName("id")
	var qest Question
	fmt.Println("-------", id)
	if err := db.Where("id = ?", id).First(&qest).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, qest)
	}
}
func GetQuestions(c *gin.Context) {
	var qests []Question
	fmt.Println("-------", db)
	if err := db.Find(&qests).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, qests)
	}
}
func CreateQuestion(c *gin.Context) {
	var qest Question
	c.BindJSON(&qest)
	qest.Date = time.Now().Format("02-Jan-2006")
	db.Create(&qest)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, qest)
}
func DeleteQestion(c *gin.Context) {
	id := c.Params.ByName("id")
	var qest Question
	d := db.Where("id = ?", id).Delete(&qest)
	if d.Error != nil {
		fmt.Println("Error!!!!  ", d)
	}
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// End Qestions

// // Quiz
// func DeleteQuiz1(c *gin.Context) {
// 	id := c.Params.ByName("id")
// 	var quiz1 Quiz1
// 	d := db.Where("id = ?", id).Delete(&quiz1)
// 	fmt.Println(d)
// 	c.Header("access-control-allow-origin", "*")
// 	c.JSON(200, gin.H{"id #" + id: "deleted"})
// }

// // End Quiz

// User
// func DeleteUser(c *gin.Context) { //+
// 	id := c.Params.ByName("id")
// 	var user User
// 	d := db.Where("id = ?", id).Delete(&user)
// 	fmt.Println(d)
// 	c.Header("access-control-allow-origin", "*")
// 	c.JSON(200, gin.H{"id #" + id: "deleted"})
// }

func CreateUser(c *gin.Context) { //+
	var user User
	c.BindJSON(&user)
	user.Password = fmt.Sprintf("%s", sha256.Sum256([]byte(user.Password)))
	db.Create(&user)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, user)
}

func GetUserById(id string) User { //+
	var user User
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		fmt.Println(err)
		return User{ID: 0, FirstName: ""}
	} else {
		return user
	}
}
func GetUserByIdHandle(c *gin.Context) {
	id := c.Params.ByName("id")
	var user User
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, fmt.Sprintf("{\"firstname\":\"%s\", \"email\":\"%s\", \"score\":%d}", user.FirstName, user.Email, user.Score))
	}
}

func GetUserByName(name string) User { //+
	var user User
	if err := db.Where("firstname = ?", name).First(&user).Error; err != nil {
		fmt.Println(err)
		return User{ID: 0, FirstName: ""}
	} else {
		return user
	}
}

// func GetUsers() []User { //+
// 	var user []User
// 	if err := db.Find(&user).Error; err != nil {
// 		fmt.Println(err)
// 		return nil
// 	} else {
// 		return user
// 	}
// }

// Get user
