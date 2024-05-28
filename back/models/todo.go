package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type Todo struct {
	ID        string    `gorm:"type:char(36);primary_key"`
	Title     string    `json:"title" binding:"required"`
	Limit     time.Time `json:"limit"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"`
}


func (t *Todo) BeforeCreate(scope *gorm.Scope) error {
	uuid := uuid.New()
	return scope.SetColumn("ID", uuid.String())
}

func (t *Todo) Save() (Todo, error) {
	err := DB.Create(&t).Error
	if err != nil {
		return Todo{}, err
	}
	return *t, nil
}

func (t *Todo) Update() (Todo, error){
	err := DB.Find(&t).Error
	if err != nil {
		return Todo{}, err
	}
	return *t, nil
}
