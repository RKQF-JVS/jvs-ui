let MSG_LIST = new Array();
//错误消息start
MSG_LIST["error.system"] = "系统异常，请重试。";
MSG_LIST["error.input.notnull"] = "{0}不能为空。";
MSG_LIST["error.input.length"] = "{0}长度为{1}到{2}个字符之间。";
MSG_LIST["error.input.min.length"] = "{0}输入长度请大于等于{1}个字符。";
MSG_LIST["error.input.max.length"] = "{0}输入长度请小于等于{1}个字符。";
MSG_LIST["error.input.format"] = "{0}请输入{1}格式的数据。";
MSG_LIST["error.date.format"] = "{0}格式错误，请选择日期。";
MSG_LIST["error.checkbox.notnull"] = "请至少选择一个{0}。";
MSG_LIST["error.select.notnull"] = "请选择{0}。";
MSG_LIST["error.regexp.format"] = "{0}输入格式错误，请重新输入。";
MSG_LIST["error.mobile.format"] = "{0}请输入正确的手机号码。";
MSG_LIST["error.phone.format"] = "{0}请输入正确的座机号码。";
MSG_LIST["error.mobilephone.format"] = "请输入正确的手机号码或者座机号码。";
MSG_LIST["error.idcard.format"] = "请输入正确的身份证号。";
MSG_LIST["error.input.float.format"] = "{0}小数点后请保留{1}位以内。";
MSG_LIST["error.batchdelete.empty"] = "请选择需要删除的数据。";
MSG_LIST["error.sort.input"] = "排序请输入正整数";
MSG_LIST["error.score.input"] = "分值请输入正整数";
MSG_LIST["error.sort.input.max"] = "排序请输入小于999999的正整数";
MSG_LIST["error.delete"] = "数据删除失败，请重试。";
MSG_LIST["error.upload"] = "文件上传失败，请重试。";
MSG_LIST["error.upload.empty"] = "请选择需要上传的文件。";
MSG_LIST["error.upload.exceed"] = "最多可上传{0}个文件。";
MSG_LIST["error.upload.type"] = "文件{0}无法上传，请上传格式为{1}结尾的文件。";
MSG_LIST["error.auth.select"] = "请选择授权内容。";
MSG_LIST["error.length.range"] = "{0}长度范围错误，maxLength需要大于等于minLength。";
MSG_LIST["error.number.range"] = "{0}请输入大于等于{1}小于等于{2}的数。";
MSG_LIST["error.number.min"] = "{0}请输入大于等于{1}的数。";
MSG_LIST["error.number.max"] = "{0}请输入小于等于{1}的数。";
MSG_LIST["error.compare.range"] = "{0}大小范围错误，max需要大于等于min";
MSG_LIST["error.search.param"] = "查询参数错误，请检查必须参数是否填写，已填写的参数格式是否正确";
MSG_LIST["error.identify.code"] = "验证码输入错误，请重新输入。";
MSG_LIST["error.org.role.param"] = "请先选择用户所属组织。";
MSG_LIST["error.confirmpwd"] = "两次密码输入的不一致，请重新输入。";
MSG_LIST["error.menutype.select"] = "请先选择菜单类型。";
MSG_LIST["error.hospital.select"] = "请选择医院。";
MSG_LIST["error.dept.select"] = "请选择科室。";
MSG_LIST["error.add.doctorhospital"] = "请添加医生执业机构。";
MSG_LIST["error.doctorhospital.select"] = "执业机构中有非系统数据。";
MSG_LIST["error.add.repeat"] = "{0}已添加，不允许重复添加。";
MSG_LIST["error.idcard.validate"] = "无效的身份证号码，请重新输入。";
MSG_LIST["error.upload.size"] = "文件太大，请上传{0}M以内的文件。";
MSG_LIST["error.authtype.select"] = "请选择入驻类型。";
MSG_LIST["error.accountName.format"] = "账号格式错误，请输入字母数字，字符允许.@_-，长度为8到18位。";
MSG_LIST["error.doctor.select"] = "请选择医生。";
MSG_LIST["error.exist.isDefault"] = "已经设置默认执业地点，不允许重复设置。";
MSG_LIST["error.exist.isMain"] = "已经设置主执业地点，不允许重复设置。";
MSG_LIST["error.doctorhospital.isDefault"] = "未禁用的执业地点请设置一个执业机构为默认执业地点。";
MSG_LIST["error.doctorhospital.isMain"] = "未禁用的执业地点请设置一个执业机构为主执业地点。";
MSG_LIST["error.fee.added"] = "该职称的诊费已设置。";
MSG_LIST["error.fees.empty"] = "请添加诊费设置。";
MSG_LIST["error.notexist.hospital"] = "该医院档案不存在，请先创建医院档案或选择医院档案";
MSG_LIST["error.notexist.approvalStatus"] = "请勾选审核意见";
MSG_LIST["error.notexist.dept"] = "该科室档案不存在，请先创建医院科室档案或选择医院科室档案";
MSG_LIST["error.notexist.reason"] = "审批意见不存在";
MSG_LIST["error.notexist.changeType"] = "请选择审批类型";
MSG_LIST["error.suggestionfee.compare"] = "建议诊费设置错误，结束值不能小于开始值";
MSG_LIST["error.suggestionfee.region"] = "请添加应用城市。";
MSG_LIST["error.video.outdate"] = "视频文件最多保存14天，该视频文件已过期，无法下载。";

//错误消息end

//确认消息start
MSG_LIST["confirm.delete.select"] = "此操作将会删除选中数据，是否继续？";
MSG_LIST["confirm.delete"] = "此操作将会删除数据，是否继续？";
MSG_LIST["confirm.stopaccount"] = "此操作将会禁用掉该医院下的所有后台账号和医生账号，是否继续？";
MSG_LIST["confirm.startaccount"] = "此操作将会启用该医院下的所有后台账号和医生账号，是否继续？";
MSG_LIST["confirm.delete.primarydept"] = "确定删除此一级科室？删除后，此科室下的二级科室将同步删除。";
MSG_LIST["confirm.delete.data"] = "确定删除{0}？";
MSG_LIST["confirm.delete.recommenddept"] = "确定删除此科室？删除后科室下的推荐医生将同步删除。";
MSG_LIST["confirm.savebatch.hospitalfee"] = "确定提交该医院对应职称下所有医生的服务规则？确定则提交此页的所有设置项，点击取消关闭此页面。";
MSG_LIST["confirm.delete.suggestionfee"] = "确定删除此条诊费建议范围？";
//确认消息end

//通知成功消息start
MSG_LIST["info.delete"] = "数据删除成功。";
MSG_LIST["info.apitest.success"] = "接口测试成功，返回数据结构:{0}";
//通知成功消息end
export default MSG_LIST;
