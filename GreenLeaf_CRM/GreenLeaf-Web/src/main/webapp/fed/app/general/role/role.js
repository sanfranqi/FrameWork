/**
 * Core script to handle the role
 */
var Role = function() {

	var getRoleList = function() {
		var url = "/role/queryRoleList.do";
		var data = {};
		io.get(url, data, function(returnData) {
			creatForm(returnData);
		});
	};

	var creatForm = function(returnData) {
		if (!returnData) {
			return;
		}

		var roleList = returnData.data;
		var html = "";

		for (var i = 0; i < roleList.length; i++) {
			var roleNode = roleList[i];
			html += "<tr class=\"odd gradeX\">";
			html += "<td><input type=\"checkbox\" class=\"checkboxes\" value=\"1\" /></td>";
			html += "<td>" + roleNode.roleName + "</td>";
			html += "<td>" + roleNode.comments + "</td>";
			html += "<td>删除</td>";
			html += "</tr>";
		}
		$("tbody").empty();
		$("tbody").append(html);
	}

	return {

		// main function to initiate the module
		init : function() {

			getRoleList();

//			if (!jQuery().dataTable) {
//				return;
//			}

			// begin first table
//			$('#sample_1').dataTable({
//				"sAjaxSource":"/role/queryRoleList.do",
//				"sAjaxDataProp": "returnData.data",
//				"aoColumns" : [ {
//					"bSortable" : false
//				}, null, {
//					"bSortable" : false
//				}, {
//					"bSortable" : false
//				} ],
//				"aLengthMenu" : [ [ 5, 15, 20, -1 ],
//				// change per page values here
//				[ 5, 15, 20, "All" ] ],
//				// set the initial value
//				"iDisplayLength" : 5,
//				"sPaginationType" : "bootstrap",
//				"oLanguage" : {
//					"sLengthMenu" : "_MENU_ records",
//					"oPaginate" : {
//						"sPrevious" : "Prev",
//						"sNext" : "Next"
//					}
//				},
//				"aoColumnDefs" : [ {
//					'bSortable' : false,
//					'aTargets' : [ 0 ]
//				} ]
//			});

			jQuery('#sample_1 .group-checkable').change(function() {
				var set = jQuery(this).attr("data-set");
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function() {
					if (checked) {
						$(this).attr("checked", true);
					} else {
						$(this).attr("checked", false);
					}
					$(this).parents('tr').toggleClass("active");
				});
				jQuery.uniform.update(set);

			});

			jQuery('#sample_1 tbody tr .checkboxes').change(function() {
				$(this).parents('tr').toggleClass("active");
			});
			// modify table search input
			jQuery('#sample_1_wrapper .dataTables_filter input').addClass(
					"form-control input-medium");
			// modify table per page dropdown
			jQuery('#sample_1_wrapper .dataTables_length select').addClass(
					"form-control input-xsmall");
			// initialize select2 dropdown
			// jQuery('#sample_1_wrapper .dataTables_length select').select2();
		}

	};

}();