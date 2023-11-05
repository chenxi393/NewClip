package util

import (
	"context"
	"newclip/config"
	"os"
	"path/filepath"
	"time"

	"github.com/qiniu/go-sdk/v7/auth/qbox"
	"github.com/qiniu/go-sdk/v7/storage"
	"go.uber.org/zap"
)

func UploadVideo(file []byte, fileName string) (string, string, error) {
	err := os.MkdirAll(config.System.HttpAddress.VideoAddress, os.ModePerm)
	if err != nil {
		zap.L().Error(err.Error())
		return "", "", err
	}
	// 还得有个变量是宿主机ip
	path := "http://" + config.System.MyIP
	outputFilePath := filepath.Join(config.System.HttpAddress.VideoAddress, fileName)
	outputFile, err := os.Create(outputFilePath)
	if err != nil {
		zap.L().Error(err.Error())
		return "", "", err
	}
	defer outputFile.Close()
	_, err = outputFile.Write(file)
	if err != nil {
		zap.L().Error(err.Error())
		return "", "", err
	}
	zap.L().Info(fileName + "已成功写入文件夹")
	videoURL := path + "/video/" + fileName
	return videoURL, config.System.HttpAddress.DefaultCoverURL, nil

}


func UploadToOSS(fileName, filePath string) (string, error) {
	putPolicy := storage.PutPolicy{
		Scope: config.System.Qiniu.Bucket,
	}
	mac := qbox.NewMac(config.System.Qiniu.AccessKey, config.System.Qiniu.SecretKey)
	upToken := putPolicy.UploadToken(mac)

	cfg := storage.Config{}
	// 是否使用https域名
	cfg.UseHTTPS = true
	// 上传是否使用CDN上传加速
	cfg.UseCdnDomains = false

	// 构建表单上传的对象
	formUploader := storage.NewFormUploader(&cfg)
	ret := storage.PutRet{}

	// 可选配置
	putExtra := storage.PutExtra{
		Params: map[string]string{
			"x:name": "github logo",
		},
	}
	// 这里其实耗时很久 感觉有3/4秒
	err := formUploader.PutFile(context.Background(), &ret, upToken, fileName, filePath, &putExtra)
	if err != nil {
		zap.L().Error(err.Error())
		return "", nil
	}
	// 这里好像是返回了CND 因为那个域名是开启了CDN的 都能访问
	deadline := time.Now().Add(time.Second * 3600).Unix() //1小时有效期
	return storage.MakePrivateURL(mac, config.System.Qiniu.OssDomain, ret.Key, deadline), nil
}