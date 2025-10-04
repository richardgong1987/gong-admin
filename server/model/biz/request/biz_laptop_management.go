package request

import (
	"github.com/richardgong1987/server/model/common/request"
)

type BizLaptopManagementSearch struct {
	Id                 *int    `json:"id" form:"id"`
	LaptopCode         *string `json:"laptopCode" form:"laptopCode"`
	OfficeLicense      *string `json:"officeLicense" form:"officeLicense"`
	MicrosoftAccount   *string `json:"microsoftAccount" form:"microsoftAccount"`
	ProductId          *string `json:"productId" form:"productId"`
	SkuId              *string `json:"skuId" form:"skuId"`
	LicenseName        *string `json:"licenseName" form:"licenseName"`
	LicenseDescription *string `json:"licenseDescription" form:"licenseDescription"`
	BetaExpiration     *string `json:"betaExpiration" form:"betaExpiration"`
	LicenseStatus      *string `json:"licenseStatus" form:"licenseStatus"`
	Status             *string `json:"status" form:"status"`
	Remark             *string `json:"remark" form:"remark"`
	request.PageInfo
}
