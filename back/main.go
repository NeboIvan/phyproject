package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	pq "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Question struct {
	ID       uint `json:"id"`
	OwnerID  uint
	Name     string         `json:"name"`
	Type     int            `json:"type"`
	ImgSrc   string         `json:"imgsrc"`
	UserName string         `json:"username"`
	Question string         `json:"question"`
	Options  pq.StringArray `json:"options" gorm:"type:text[]"`
	Date     string         `json:"date"`
	Ans      pq.StringArray `json:"ans" gorm:"type:text[]"`
}
type Quiz struct {
	ID          uint `json:"id"`
	OwnerID     uint
	Name        string         `json:"name"`
	UserName    string         `json:"username"`
	QuestionsID pq.Int32Array  `json:"questions" gorm:"type:int[]"`
	Date        string         `json:"date"`
	Ans         pq.StringArray `json:"ans" gorm:"type:text[]"`
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

func main() {
	var err error
	gin.SetMode(gin.ReleaseMode)
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

	db.AutoMigrate(&Question{})
	db.AutoMigrate(&Quiz{})
	db.AutoMigrate(&TokenBase{})

	r := gin.Default()
	r.GET("/q", GetQuestions)
	r.GET("/q/:id", GetQuestion)
	r.POST("/newq", CreateQuestion)
	r.DELETE("/delq/:id", DeleteQestion)

	r.GET("/quiz", GetQuestions)
	r.GET("/quiz/:id", GetQuestion)
	r.POST("/newquiz", CreateQuestion)
	r.DELETE("/delquiz/:id", DeleteQestion)

	r.Use((cors.Default()))
	r.Run(":8080")
}

// Qestions
func GetQuestion(c *gin.Context) {
	id := c.Params.ByName("id")
	var qest Question
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
// Quiz
func GetQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	if err := db.Where("id = ?", id).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, quiz)
	}
}
func GetQuizs(c *gin.Context) {
	var quizs []Quiz
	if err := db.Find(&quizs).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, quizs)
	}
}
func CreateQuiz(c *gin.Context) {
	var quiz Quiz
	c.BindJSON(&quiz)
	quiz.Date = time.Now().Format("02-Jan-2006")
	db.Create(&quiz)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, quiz)
}
func DeleteQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	d := db.Where("id = ?", id).Delete(&quiz)
	if d.Error != nil {
		fmt.Println("Error!!!!  ", d)
	}
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// End Quiz
