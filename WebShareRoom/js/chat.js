	$('.conLeft li').on('click',function(){
		$(this).addClass('bg').siblings().removeClass('bg');
		var intername=$(this).children('.liRight').children('.intername').text();
		//$('.headName').text(intername);
		//$('.newsList').html('');
	})
	/*$('.sendBtn').on('click',function(){
		
		//var ans_news=$('#dope').val();
		var ans_news=GetContent();;
		if(ans_news==''){
			alert('不能为空');
		}else{
			//$('#dope').val('');
			SetContent("");
		var str='';
		str+='<li>'+
				'<div class="answerHead"><img src="img/6.jpg"/></div>'+
				'<div class="answers"><img class="jiao" src="img/20170926103645_03_02.jpg">'+ans_news+'</div>'+
			'</li>';
		$('.newsList').append(str);
		setTimeout(answers_news,1000); 
		$('.conLeft').find('li.bg').children('.liRight').children('.infor').text((ans_news.length>9)?ans_news.substring(0,9)+'...':ans_news.substring(0,9));
		$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
	}
	
	})*/
	function answers_news(){
		var arr=["你好","今天天气很棒啊","你吃饭了吗？","我最美我最美","我是可爱的僵小鱼","你们忍心这样子对我吗？","spring天下无敌，实习工资850","我不管，我最帅，我是你们的小可爱","段友出征，寸草不生","一入段子深似海，从此节操是路人","馒头：嗷","突然想开个车","段子界混的最惨的两个狗：拉斯，普拉达。。。"];
		var aa=Math.floor((Math.random()*arr.length));
		var answer='';
		answer+='<li>'+
					'<div class="new_name">这是我的名字哦哦</div>'+
					'<div class="nesHead"><img src="img/tou.jpg"/></div>'+
					'<div class="news"><img class="jiao" src="img/jiao.jpg">'+arr[aa]+'</div>'+
				'</li>';
		$('.newsList').append(answer);	
		$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
	}
	/*$('.ExP').on('mouseenter',function(){
		$('.emjon').show();
	})
	$('.emjon').on('mouseleave',function(){
		$('.emjon').hide();
	})
	$('.emjon li').on('click',function(){
		var imgSrc=$(this).children('img').attr('src');
		var str="";
		str+='<li>'+
				'<div class="answerHead"><img src="img/6.jpg"/></div>'+
				'<div class="answers"><img class="jiao" src="img/20170926103645_03_02.jpg"><img class="Expr" src="'+imgSrc+'"></div>'+
			'</li>';
		$('.newsList').append(str);
		$('.emjon').hide();
		$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
	})*/
	
	var editorIndex;
	var layedit;
	$(function(){
		layui.use('layedit', function(){
		  layedit = layui.layedit
		  ,$ = layui.jquery;
		  
		  //构建一个默认的编辑器
		  editorIndex = layedit.build('dope', {
			  tool: [
			  'strong' //加粗
			  ,'italic' //斜体
			  ,'underline' //下划线
			  ,'del' //删除线
			  ,'|' //分割线
			  ,'left' //左对齐
			  ,'center' //居中对齐
			  ,'right' //右对齐
			  ,'link' //超链接
			  ,'unlink' //清除链接
			  ,'face' //表情
			  //,'image' //插入图片
			  //帮助,'help' 
			],
			  height: 150 //设置编辑器高度
			  
			});
		 
		});

	})

	function GetContent(){
		return layedit.getContent(editorIndex);
	}
	function SetContent(value){
		layedit.setContent(editorIndex,value);
	}
