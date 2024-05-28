package controllers

import (
	"back/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type TodoInput = struct {
	Title string    `json:"title" binding:"required"`
	Limit time.Time `json:"limit"`
}

func FindAll(c *gin.Context) {
	var todos []models.Todo
	if err := models.DB.Find(&todos).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": todos})
}

func Save(c *gin.Context) {
	var input TodoInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo := models.Todo{Title: input.Title, Limit: input.Limit}

	todo, err := todo.Save()

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": todo})
}

func Update(c *gin.Context) {
	var todo models.Todo
	if err := models.DB.Where("id = ?", c.Param("id")).First(&todo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	var input TodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Model(&todo).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": todo})
}

func Delete(c *gin.Context) {
	var todo models.Todo
	if err := models.DB.Where("id = ?", c.Param("id")).First(&todo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	models.DB.Delete(&todo)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
