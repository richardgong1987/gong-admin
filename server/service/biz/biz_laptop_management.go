package biz

import (
	"context"

	"github.com/richardgong1987/server/global"
	"github.com/richardgong1987/server/model/biz"
	bizReq "github.com/richardgong1987/server/model/biz/request"
)

type BizLaptopManagementService struct{}

// CreateBizLaptopManagement 创建bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) CreateBizLaptopManagement(ctx context.Context, bizLaptopManagement *biz.BizLaptopManagement) (err error) {
	err = global.GVA_DB.Create(bizLaptopManagement).Error
	return err
}

// DeleteBizLaptopManagement 删除bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) DeleteBizLaptopManagement(ctx context.Context, id string) (err error) {
	err = global.GVA_DB.Delete(&biz.BizLaptopManagement{}, "id = ?", id).Error
	return err
}

// DeleteBizLaptopManagementByIds 批量删除bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) DeleteBizLaptopManagementByIds(ctx context.Context, ids []string) (err error) {
	err = global.GVA_DB.Delete(&[]biz.BizLaptopManagement{}, "id in ?", ids).Error
	return err
}

// UpdateBizLaptopManagement 更新bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) UpdateBizLaptopManagement(ctx context.Context, bizLaptopManagement biz.BizLaptopManagement) (err error) {
	err = global.GVA_DB.Model(&biz.BizLaptopManagement{}).Where("id = ?", bizLaptopManagement.Id).Updates(&bizLaptopManagement).Error
	return err
}

// GetBizLaptopManagement 根据id获取bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) GetBizLaptopManagement(ctx context.Context, id string) (bizLaptopManagement biz.BizLaptopManagement, err error) {
	err = global.GVA_DB.Where("id = ?", id).First(&bizLaptopManagement).Error
	return
}

// GetBizLaptopManagementInfoList 分页获取bizLaptopManagement表记录
// Author [yourname](https://github.com/yourname)
func (bizLaptopManagementService *BizLaptopManagementService) GetBizLaptopManagementInfoList(ctx context.Context, info bizReq.BizLaptopManagementSearch) (list []biz.BizLaptopManagement, total int64, err error) {
	limit := info.PageSize
	offset := info.PageSize * (info.Page - 1)
	// 创建db
	db := global.GVA_DB.Model(&biz.BizLaptopManagement{})
	var bizLaptopManagements []biz.BizLaptopManagement
	// 如果有条件搜索 下方会自动创建搜索语句

	if info.Id != nil {
		db = db.Where("id = ?", *info.Id)
	}
	if info.LaptopCode != nil && *info.LaptopCode != "" {
		db = db.Where("laptop_code LIKE ?", "%"+*info.LaptopCode+"%")
	}
	if info.OfficeLicense != nil && *info.OfficeLicense != "" {
		db = db.Where("office_license LIKE ?", "%"+*info.OfficeLicense+"%")
	}
	if info.MicrosoftAccount != nil && *info.MicrosoftAccount != "" {
		db = db.Where("microsoft_account LIKE ?", "%"+*info.MicrosoftAccount+"%")
	}
	if info.ProductId != nil && *info.ProductId != "" {
		db = db.Where("product_id LIKE ?", "%"+*info.ProductId+"%")
	}
	if info.SkuId != nil && *info.SkuId != "" {
		db = db.Where("sku_id LIKE ?", "%"+*info.SkuId+"%")
	}
	if info.LicenseName != nil && *info.LicenseName != "" {
		db = db.Where("license_name LIKE ?", "%"+*info.LicenseName+"%")
	}
	if info.LicenseDescription != nil && *info.LicenseDescription != "" {
		db = db.Where("license_description LIKE ?", "%"+*info.LicenseDescription+"%")
	}
	if info.BetaExpiration != nil && *info.BetaExpiration != "" {
		db = db.Where("beta_expiration LIKE ?", "%"+*info.BetaExpiration+"%")
	}
	if info.LicenseStatus != nil && *info.LicenseStatus != "" {
		db = db.Where("license_status LIKE ?", "%"+*info.LicenseStatus+"%")
	}
	if info.Status != nil && *info.Status != "" {
		db = db.Where("status = ?", *info.Status)
	}
	if info.Remark != nil && *info.Remark != "" {
		db = db.Where("remark LIKE ?", "%"+*info.Remark+"%")
	}
	err = db.Count(&total).Error
	if err != nil {
		return
	}

	if limit != 0 {
		db = db.Limit(limit).Offset(offset)
	}

	err = db.Find(&bizLaptopManagements).Error
	return bizLaptopManagements, total, err
}
func (bizLaptopManagementService *BizLaptopManagementService) GetBizLaptopManagementPublic(ctx context.Context) {
	// 此方法为获取数据源定义的数据
	// 请自行实现
}
