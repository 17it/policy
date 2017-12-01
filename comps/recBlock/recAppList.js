var getData=$require("main/other/getSoftData").getData;
module.exports = function*(cmsId, num, langName, geo) {
    langName=="en_us"&&(langName="en");
    return yield getData(cmsId, num, langName, geo);
};