package model

import "time"

type Video struct {
	ID            uint64    `json:"id"`
	AuthorID      uint64    `gorm:"not null;index" json:"author_id"`
	PlayURL       string    `gorm:"type:varchar(256);not null" json:"play_url"`
	CoverURL      string    `gorm:"type:varchar(256);not null" json:"cover_url"`
	Title         string    `gorm:"type:varchar(63);index:,class:FULLTEXT,option:WITH PARSER ngram;not null" json:"title"`
	PublishTime   time.Time `gorm:"not null;index" json:"publish_time"`
	FavoriteCount int64     `gorm:"default:0;not null" json:"favorite_count"`
	CommentCount  int64     `gorm:"default:0;not null" json:"comment_count"`
	// 视频的分类 23.11.03新增
	Topic string `gorm:"type:varchar(32);index:;not null" json:"topic"`
}

