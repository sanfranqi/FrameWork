/**
 * Core script to handle the sidebar
 */
var SideBar = function() {
	
	// init Menus
	var initMenus = function(menuLink) {
		getMenuTree(menuLink);
	}

	// get menu tree
	var getMenuTree = function(menuLink) {

		var url = "/menu/queryMenuList.do";
		var data = {};
		io.get(url, data, function(returnData) {
			createMenus(returnData,menuLink);
		});
	};

	// create menus
	var createMenus = function(menuJson,menuLink) {
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
				li += "<li class=\"" + liClass + "\" id =\"" + parentMenu.keyName
						+ "\"><a href=\"" + parentMenu.method
						+ "\"><i class=\"fa " + parentMenu.icon
						+ "\"></i><span class=\"title\">" + parentMenu.menuName
						+ "</span>";
				var hasChild = false;
				var childLi = "";
				for (var j = 1; j < menuList.length; j++) {
					var childMenu = menuList[j];
					if (childMenu.parentId != 0
							&& parentMenu.id == childMenu.parentId) {
						hasChild = true;
						childLi += "<li id =\"" + childMenu.keyName
								+ "\"><a href=\"" + childMenu.method + "\">"
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
		//add menus
		$(".page-sidebar-menu").append(li);
		//remove old style
		$(".active").removeClass("active");
		$(".open").removeClass("open");
		$("span.selected").remove();
		//get select menu
		var clickMenu = $("#"+menuLink);
		//add select menu active
		clickMenu.addClass("active");
		//get parent li tag
		var parentLi = clickMenu.parent().parent("li");
		if(parentLi.length>0){// has parent
			parentLi.addClass("active");
			parentLi.children("a").children("span.arrow").addClass("open");
			parentLi.children("a").append("<span class=\"selected\"></span>");
		}else{//no parent
			clickMenu.children("a").append("<span class=\"selected\"></span>");
		}
	};

	return {

		init : function(menuLink) {
			initMenus(menuLink);
		}

	};

}();