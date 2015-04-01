/**
 * Core script to handle the sidebar
 */
var Sidebar = function() {

	// init Menus
	var initMenus = function() {
		getMenuTree();
	}

	// get menu tree
	var getMenuTree = function() {

		var url = "/menu/queryMenuList.do";
		var data = {};

		io.get(url, data, function(returnData) {
			createMenus(returnData);
		});
	};

	// create menus
	var createMenus = function(menuJson) {
		// $(".active").removeClass("active");
		if (!menuJson) {
			return;
		}
		var menuList = menuJson.data;
		var li = "";
		var liArrow = "<span class=\"arrow \"></span>";
		var liAend = "</a>";
		var subMenuBegin = "<ul class=\"sub-menu\">";
		var subMenuEnd = "</ul>";
		for (var i = 0; i < menuList.length; i++) {
			var parentMenu = menuList[i];
			if (parentMenu.parentId == 0) {
				var liClass = "";
				// if (i == 0) {
				// liClass = "active";
				// }
				li += "<li class=\""
						+ liClass
						+ "\"><a href=\"index.html\"><i class=\"fa fa-home\"></i><span class=\"title\">"
						+ parentMenu.menuName + "</span>";
				var hasChild = false;
				var childLi = "";
				for (var j = 1; j < menuList.length; j++) {
					var childMenu = menuList[j];
					if (childMenu.parentId != 0
							&& parentMenu.id == childMenu.parentId) {
						hasChild = true;
						childLi += "<li><a href=\"index.html\">"
								+ childMenu.menuName + "</li>"
					}
				}
				if (hasChild) {
					li += liArrow + liAend + subMenuBegin + childLi
							+ subMenuEnd;
				} else {
					li += liAend;
				}
				li += "</li>";
			}
		}
		$(".page-sidebar-menu").append(li);
	};

	return {

		init : function() {
			initMenus();
		}

	};

}();