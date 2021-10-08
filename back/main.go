package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Question struct {
	ID       uint `json:"id"`
	OwnerID  uint
	Name     string `json:"name"`
	UserName string `json:"username"`
	Question string `json:"question"`
	Options  string `json:"options"`
	Date     string `json:"date"`
	Ans      string `json:"ans"`
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

	r := gin.Default()
	r.GET("/q", GetQuestions)
	r.GET("/q/:id", GetQuestion)
	r.POST("/newq", CreateQuestion)
	r.DELETE("/delq/:id", DeleteQestion)

	r.Use((cors.Default()))
	r.Run(":8080")
}

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
