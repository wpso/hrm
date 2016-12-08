function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]);
    return null;
}

//变更按钮颜色
function changeColor(id) {
	var result = {
        "mouseout" : function() {
            document.getElementById(id).style.color = "white";
        },
        "mouseover" : function() {
            document.getElementById(id).style.color = "black";
        }
    }
	return result;
}

//刷新页面
function reLoadData(store){
    store.load();
}

//删除后刷新页面
function afterDelete(store) {
    var count = store.data.length;
    var total = store.getTotalCount();
    if(total != 1 && count == 1) {
    	store.previousPage();
    } else {
    	store.load();
    }
}

//alert提示
function alertOKShow(title, msg, fn) {
	Ext.MessageBox.show({
        title : title,
        msg : msg,
        icon : Ext.MessageBox.INFO,
        buttons : Ext.MessageBox.OK,
        fn: fn
    });
}

Ext.onReady(function() {
				var params;
				MultiLang = (function() {
					return {
						init : function() {
							params = getCookie("lang");
							i18n.set({
								lang : params,
								path : '../../resources'
							});
							if (params) {
								var url = Ext.util.Format
										.format(
												'../../extjs-4.1.0/locale/ext-lang-{0}.js',
												params);
								Ext.Ajax.request({
									url : url,
									success : this.onLoadExtLocaleSuccess,
									failure : this.onLoadExtLocaleFailure,
									scope : this
								});
							} else {
								this.setup();
							}
						},
						onLoadExtLocaleSuccess : function(response) {
							try {
								eval(response.responseText);
							} catch (e) {
							}
							this.setup();
						},
						onLoadExtLocaleFailure : function() {
							this.setup();
						},
						setup : renderPage
					};
				})();
				MultiLang.init();
});