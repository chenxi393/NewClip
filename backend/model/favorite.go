package model

type Favorite struct {
	ID      uint64 `gorm:"primaryKey"`
	UserID  uint64 `gorm:"not null;uniqueIndex:idx_user_video"`
	VideoID uint64 `gorm:"not null;uniqueIndex:idx_user_video"`
}
