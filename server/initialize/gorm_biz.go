package initialize

import (
	"github.com/richardgong1987/server/global"
	"github.com/richardgong1987/server/model/biz"
)

func bizModel() error {
	db := global.GVA_DB
	err := db.AutoMigrate(biz.BizLaptopManagement{})
	if err != nil {
		return err
	}
	return nil
}
