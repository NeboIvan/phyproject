package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Application struct {
	db *gorm.DB
}

type Question struct {
	gorm.Model

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
	gorm.Model

	ID          uint `json:"id"`
	OwnerID     uint
	Name        string         `json:"name"`
	UserName    string         `json:"username"`
	QuestionsID pq.Int32Array  `json:"questions" gorm:"type:int[]"`
	Date        string         `json:"date"`
	Ans         pq.StringArray `json:"ans" gorm:"type:text[]"`
}

func main() {
	GetApp()
}

func GetApp() {
	var err error
	var dsn string
	var app Application
	dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PORT"))
	app.db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
	}
	app.CreateCreator()
}

func (app *Application) CreateCreator() {
	fff, _ := app.db.DB()

	defer fff.Close()

	app.db.AutoMigrate(&Question{})
	app.db.AutoMigrate(&Quiz{})

	r := gin.Default()
	r.GET("/q", app.GetQuestions)
	r.GET("/q/:id", app.GetQuestion)
	r.POST("/newq", app.CreateQuestion)
	r.DELETE("/delq/:id", app.DeleteQestion)

	r.GET("/quiz", app.GetQuizs)
	r.GET("/quiz/:id", app.GetQuiz)
	r.POST("/newquiz", app.CreateQuiz)
	r.DELETE("/delquiz/:id", app.DeleteQuiz)

	r.Use((cors.Default()))
	r.Run(":8080")
}

// Qestions
func (app *Application) GetQuestion(c *gin.Context) {
	id := c.Params.ByName("id")
	var qest Question
	if err := app.db.Model(&Question{}).Where("id = ?", id).First(&qest).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, qest)
	}
}
func (app *Application) GetQuestions(c *gin.Context) {
	var qests []Question
	if err := app.db.Model(&Question{}).Find(&qests).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, qests)
	}
}
func (app *Application) CreateQuestion(c *gin.Context) {
	var qest Question
	c.BindJSON(&qest)
	qest.Date = time.Now().Format("02-Jan-2006")
	app.db.Model(&Question{}).Create(&qest)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, qest)
}
func (app *Application) DeleteQestion(c *gin.Context) {
	id := c.Params.ByName("id")
	var qest Question
	d := app.db.Model(&Question{}).Where("id = ?", id).Delete(&qest)
	if d.Error != nil {
		fmt.Println("Error!!!!  ", d)
	}
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// End Qestions
// Quiz
func (app *Application) GetQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	if err := app.db.Model(&Quiz{}).Where("id = ?", id).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, quiz)
	}
}
func (app *Application) GetQuizs(c *gin.Context) {
	var quizs []Quiz
	if err := app.db.Model(&Quiz{}).Find(&quizs).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, quizs)
	}
}
func (app *Application) CreateQuiz(c *gin.Context) {
	var quiz Quiz
	c.BindJSON(&quiz)
	quiz.Date = time.Now().Format("02-Jan-2006")
	app.db.Model(&Quiz{}).Create(&quiz)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, quiz)
}
func (app *Application) DeleteQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	d := app.db.Model(&Quiz{}).Where("id = ?", id).Delete(&quiz)
	if d.Error != nil {
		fmt.Println("Error!!!!  ", d)
	}
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// End Quiz
