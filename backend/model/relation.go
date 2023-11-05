package model

type Follow struct {
	ID       uint64 `gorm:"primaryKey"`
	UserID   uint64 `gorm:"not null;uniqueIndex:idx_user_touser"`
	ToUserID uint64 `gorm:"not null;uniqueIndex:idx_user_touser;index"`
}
