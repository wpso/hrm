function Pagination() {
	this.totalPages =1;
	this.pageSize = 10;
	this.pageNo =1;
	this.totalCount = 0;
	this.callback = null;

	if (arguments.length == 4) {
		this.totalPages = arguments[0];
		this.pageSize = arguments[1];
		this.pageNo = arguments[2];
		this.totalCount = arguments[3];
	}
	
	this.render = function(callback) {
		if (callback) {
			this.callback = callback;
		}
		if(this.totalPages <= 1){
			return $("<span></span>");
		}
		var doc = "";
		doc = "<div id=\"Pagination_Class\"><ul>";
		doc += "<li><a href=\"#\" class='leftShift'> < </a></li>";
		if (this.totalPages > 10) {
			for (var i = 1; i <= 6; i++) {
				doc += "<li><a href=\"#\" class='num' alt='" + i + "'>" + i + "</a></li>"
				if (i == 2) {
					doc += "<li class=\"dot1\">...</li>";
				}
			}
			doc += "<li class=\"dot\">...</li>";
			for (var i = this.totalPages - 2; i <= this.totalPages; i++) {
				doc += "<li><a href=\"#\" class='num' alt='" + i + "'>" + i + "</a></li>"
			}
		} else {

			for (var i = 1; i <= this.totalPages; i++) {
				doc += "<li><a href=\"#\" class='num' alt='" + i + "'>" + i + "</a></li>"
			}

		}
		doc += "<li><a href=\"#\" class='rightShift'> > </a></li>";
		doc += "</ul></div>";

		var div = $(doc);
		
		$(".num[alt='" + this.pageNo + "']",div).css("background-color", "rgb(238,117,0)");
		
		$(".leftShift", div).click(this,clickMatterLeft);
		$(".rightShift", div).click(this,clickMatterRight);
		$(".num", div).click(this,clickMatterNum);

		return div;
	};
	
	var clickMatterLeft = function(event) {
		var p = event.data;
		if (!( typeof p.pageNo == "undefined")) {
			if (p.pageNo > 1) {
				p.pageNo--;
			}
		} else {
			p.pageNo = 1;
		}
		p.changePage();
	};

	var clickMatterRight = function(event) {
		var p = event.data;
		if ( typeof p.pageNo == "undefined") {
			p.pageNo = p.totalPages;
		}

		if (p.pageNo != p.totalPages) {
			p.pageNo++;
		}
		p.changePage();
	};

	var clickMatterNum = function(event) {
		var p = event.data;
		p.pageNo = parseInt($(this).attr("alt"));
		p.changePage();
	};

	this.changePage = function() {
		if (this.totalPages > 10) {
			var pageIndex = 1;
			var pageEnd = 6;
			if (this.pageNo > 4) {
				pageEnd = parseInt(this.pageNo) + 2;
				if (pageEnd <= this.totalPages - 3) {
					pageIndex = this.pageNo - 3;
				} else {
					pageIndex = this.totalPages - 8;
				}
			}

			var j = 0;
			if (pageIndex >= this.totalPages - 8) {
				for (var i = this.totalPages - 8; i <= this.totalPages; i++) {
					var t = j++;
					if (t > 1) {
						$($(".num")[t]).attr("alt", i);
						$($(".num")[t]).text(i);
					} else {
						$($(".num")[t]).attr("alt", parseInt(t) + 1);
						$($(".num")[t]).text(parseInt(t) + 1);
					}
					$(".dot1").attr("style","display:inline-block").show();
					$(".dot").hide();
				}
			} else {
				j = 0;
				for (var i = pageIndex; i <= pageEnd; i++) {
					var t = j++;
					$($(".num")[t]).attr("alt", i);
					$($(".num")[t]).text(i);
					$(".dot").show();
					$(".dot1").hide();
				}
			}
		}

		$(".num").css("background-color", "white");
		$(".num[alt='" + this.pageNo + "']").css("background-color", "rgb(238,117,0)");
		if (this.callback) {
			this.callback(this.totalPages, this.pageSize, this.pageNo, this.totalCount);
			$(".num[alt='" + this.pageNo + "']").css("font-weight", "bold");
		}
	};
}
