function inputSelect(div_id, saveval_id) {
	this.input_id = $("#" + div_id + ' .newinput');
	this.input_div = $("#" + div_id + ' .input_div');
	this.input_id.focus(function () {
		$("#" + div_id + ' .input_div').show();
	});
	this.input_id.keyup(function () {
		var st = $(this).val().trim();
		var _this = this;
		if (st == '') {
			$("span", $("#" + div_id + ' .input_div')).show();
			$("#" + div_id + ' .input_div').show();
			var selval = 0;
			$(".savedata", $("#" + div_id)).val(selval);
			return false;
		}
		var L = $("span", $("#" + div_id + ' .input_div')).size();
		for (var i = 0; i < L; i++) {
			var elem = $("span", $("#" + div_id + ' .input_div')).eq(i);
			var html = $("span", $("#" + div_id + ' .input_div')).eq(i).html();
			if (html.match(st)) {
				elem.show();
			} else {
				elem.hide();
			}
		}
		var selval = -1;
		if ($("span:visible", $("#" + div_id + ' .input_div')).length == 1 || $("span:visible", $("#" + div_id + ' .input_div')).eq(0).html() == st) {
			selval = $("span:visible", $("#" + div_id + ' .input_div')).eq(0).attr('data-val');
		} else {
			selval = 99999;
		}
		$(".savedata", $("#" + div_id)).val(selval);
		$("#" + div_id + ' .input_div').show();
	});
	this.input_id.blur(function () {
		$("#" + div_id + ' .input_div').slideUp(50);
	});
	$("span", $("#" + div_id + ' .input_div')).on("mousedown",function () {
		var val = $(this).data('val');
		$("#" + div_id + ' .newinput').val($(this).html());
		$(".savedata", $("#" + div_id)).val(val);
	})

}

function BindEvet(valid,div_id){
	$('[data-val="'+valid+'"]').on("mousedown",function () {
		var val = $(this).data('val');
		$("#" + div_id + ' .newinput').val($(this).html());
		$(".savedata", $("#" + div_id)).val(val);
	})
}