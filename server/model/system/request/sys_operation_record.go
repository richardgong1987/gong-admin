package request

import (
	"github.com/richardgong1987/server/model/common/request"
	"github.com/richardgong1987/server/model/system"
)

type SysOperationRecordSearch struct {
	system.SysOperationRecord
	request.PageInfo
}
