package utils

import "github.com/luabagg/orcgen"

var htmltoPDFTool = orcgen.New(orcgen.PDF)

func HtmlToPDF(html []byte) ([]byte, error) {
	htmltoPDFTool.SetFullPage(true)
	fi, err := htmltoPDFTool.ConvertHTML(html)
	if err != nil {
		return nil, err
	}
	return fi.File, nil
}
