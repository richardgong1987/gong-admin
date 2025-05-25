package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/richardgong1987/server/core"
	"github.com/richardgong1987/server/global"
	"github.com/richardgong1987/server/initialize"
	"github.com/richardgong1987/server/model/system/response"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

type TestResponse struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}

type TestLoginResponse struct {
	Code int `json:"code"`
	Data response.LoginResponse
	Msg  string `json:"msg"`
}

var tgbRouter *gin.Engine
var UserInfo1 *TestLoginResponse

func init() {
	tgbRouter = LounchServer()
	loginData := `{"username":"admin","password":"iphone16pro@admin","captcha":""}`
	req, _ := http.NewRequest("POST", "/base/login", bytes.NewBuffer([]byte(loginData)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	tgbRouter.ServeHTTP(w, req)
	JSONToStruct(w.Body.String(), &UserInfo1)
}

func setup() {
}

func LounchServer() *gin.Engine {
	global.GVA_VP = core.Viper() // 初始化Viper
	initialize.OtherInit()
	global.GVA_LOG = core.Zap() // 初始化zap日志库
	zap.ReplaceGlobals(global.GVA_LOG)
	global.GVA_DB = initialize.Gorm() // gorm连接数据库
	initialize.Timer()
	initialize.DBList()
	if global.GVA_DB != nil {
		initialize.RegisterTables() // 初始化表
		// 程序结束前关闭数据库链接
		global.GVA_DB.DB()
	}
	return core.RunServer()
}

func POST2(expectcode int, url string, stur interface{}, t *testing.T) *httptest.ResponseRecorder {
	// Check if the URL starts with "/api"
	if strings.HasPrefix(url, "/api") {
		// Remove "/api" from the beginning of the URL
		url = url[len("/api"):]
	}
	body, _ := json.Marshal(stur)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.AddCookie(&http.Cookie{Name: "x-token", Value: UserInfo1.Data.Token})
	w := httptest.NewRecorder()
	tgbRouter.ServeHTTP(w, req)
	assert.Equal(t, expectcode, w.Code)
	return w
}

func PUT2(expectcode int, url string, body interface{}, t *testing.T, stru interface{}) *httptest.ResponseRecorder {
	// Check if the URL starts with "/api"
	if strings.HasPrefix(url, "/api") {
		// Remove "/api" from the beginning of the URL
		url = url[len("/api"):]
	}
	jsonBody, _ := json.Marshal(body)
	req, _ := http.NewRequest("PUT", url, bytes.NewBuffer([]byte(jsonBody)))
	req.Header.Set("Content-Type", "application/json")
	req.AddCookie(&http.Cookie{Name: "x-token", Value: UserInfo1.Data.Token})
	w := httptest.NewRecorder()
	tgbRouter.ServeHTTP(w, req)
	assert.Equal(t, expectcode, w.Code)
	GetResultAsStruct(w, stru)
	return w
}

func GET2(expectcode int, url string, t *testing.T, stru interface{}) *httptest.ResponseRecorder {
	// Check if the URL starts with "/api"
	if strings.HasPrefix(url, "/api") {
		// Remove "/api" from the beginning of the URL
		url = url[len("/api"):]
	}

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Content-Type", "application/json")
	req.AddCookie(&http.Cookie{Name: "x-token", Value: UserInfo1.Data.Token})
	w := httptest.NewRecorder()
	tgbRouter.ServeHTTP(w, req)
	assert.Equal(t, expectcode, w.Code)
	GetResultAsStruct(w, stru)
	return w
}

func DELETE2(expectcode int, url string, t *testing.T, stru interface{}) *httptest.ResponseRecorder {
	// Check if the URL starts with "/api"
	if strings.HasPrefix(url, "/api") {
		// Remove "/api" from the beginning of the URL
		url = url[len("/api"):]
	}
	/**
	  i want to make a delete http request with cookie, but i don't know how to do it
	*/
	req, _ := http.NewRequest("DELETE", url, bytes.NewBuffer([]byte("")))
	req.AddCookie(&http.Cookie{Name: "x-token", Value: UserInfo1.Data.Token})
	w := httptest.NewRecorder()
	tgbRouter.ServeHTTP(w, req)
	assert.Equal(t, expectcode, w.Code)
	GetResultAsStruct(w, stru)
	return w
}

func JSONToStruct(jsonData string, stru interface{}) {
	err := json.Unmarshal([]byte(jsonData), stru)
	if err != nil {
		// Handle error
		fmt.Println("Error:", err)
		return
	}
}
func GetResultAsStruct(w *httptest.ResponseRecorder, stru interface{}) {
	JSONToStruct(w.Body.String(), stru)
}

func ReadJson(path string, stru interface{}) {
	jsonData, _ := os.ReadFile(path)
	JSONToStruct(string(jsonData), stru)
}
