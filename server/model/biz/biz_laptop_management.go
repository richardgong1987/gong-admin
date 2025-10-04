// 自动生成模板BizLaptopManagement
package biz

import (
	"time"
)

// bizLaptopManagement表 结构体  BizLaptopManagement
type BizLaptopManagement struct {
	Id                 *int64     `json:"id" form:"id" gorm:"primarykey;comment:id;column:id;"`                                                                 //id
	CreatedAt          *time.Time `json:"createdAt" form:"createdAt" gorm:"comment:created_at;column:created_at;"`                                              //created_at
	CreatedBy          *int64     `json:"createdBy" form:"createdBy" gorm:"comment:created_by;column:created_by;"`                                              //created_by
	Creator            *string    `json:"creator" form:"creator" gorm:"comment:creator;column:creator;size:191;"`                                               //creator
	UpdatedAt          *time.Time `json:"updatedAt" form:"updatedAt" gorm:"comment:updated_at;column:updated_at;"`                                              //updated_at
	UpdatedBy          *int64     `json:"updatedBy" form:"updatedBy" gorm:"comment:updated_by;column:updated_by;"`                                              //updated_by
	Updater            *string    `json:"updater" form:"updater" gorm:"comment:updater;column:updater;size:191;"`                                               //updater
	DeletedBy          *int64     `json:"deletedBy" form:"deletedBy" gorm:"comment:deleted_by;column:deleted_by;"`                                              //deleted_by
	DeletedAt          *time.Time `json:"deletedAt" form:"deletedAt" gorm:"column:deleted_at;"`                                                                 //deletedAt字段
	LaptopCode         *string    `json:"laptopCode" form:"laptopCode" gorm:"comment:番号;column:laptop_code;size:191;"`                                          //番号
	OfficeLicense      *string    `json:"officeLicense" form:"officeLicense" gorm:"comment:ライセンスキー;column:office_license;size:191;"`                            //ライセンスキー
	MicrosoftAccount   *string    `json:"microsoftAccount" form:"microsoftAccount" gorm:"comment:Microsoft Account;column:microsoft_account;size:191;"`         //Microsoft Account
	ProductId          *string    `json:"productId" form:"productId" gorm:"comment:PRODUCT_ID;column:product_id;size:191;"`                                     //PRODUCT_ID
	SkuId              *string    `json:"skuId" form:"skuId" gorm:"comment:SKU_ID;column:sku_id;size:191;"`                                                     //SKU_ID
	LicenseName        *string    `json:"licenseName" form:"licenseName" gorm:"comment:LICENSE_NAME;column:license_name;size:191;"`                             //LICENSE_NAME
	LicenseDescription *string    `json:"licenseDescription" form:"licenseDescription" gorm:"comment:LICENSE_DESCRIPTION;column:license_description;size:191;"` //LICENSE_DESCRIPTION
	BetaExpiration     *string    `json:"betaExpiration" form:"betaExpiration" gorm:"comment:BETA_EXPIRATION;column:beta_expiration;size:191;"`                 //BETA_EXPIRATION
	LicenseStatus      *string    `json:"licenseStatus" form:"licenseStatus" gorm:"comment:LICENSE_STATUS;column:license_status;size:191;"`                     //LICENSE_STATUS
	Status             *string    `json:"status" form:"status" gorm:"comment:status;column:status;size:191;"`                                                   //status
	Remark             *string    `json:"remark" form:"remark" gorm:"comment:remark;column:remark;size:191;"`                                                   //remark
}

// TableName bizLaptopManagement表 BizLaptopManagement自定义表名 biz_laptop_management
func (BizLaptopManagement) TableName() string {
	return "biz_laptop_management"
}
