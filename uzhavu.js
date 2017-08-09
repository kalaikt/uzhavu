
// Remove space at begining of the string
String.prototype.ltrim = function(){
	return this.replace(/^\s+/,'');
}

// Remove space at ending of the string
String.prototype.rtrim = function(){
	return this.replace(/\s+$/,'');
}

// Remove space at ending of the string
String.prototype.nl2br = function(){
	return this.replace('\n','<br/>');
}
String.prototype.lpad = function(n, t){
	var pad = '';
	
	for(i=0;i<n-this.length;i++) pad +=(t?t:'0');
	
	return pad+this;
}

String.prototype.capitalize = function () {
  return this.replace(/\b(\w)/g, function (match) {
    return match.toUpperCase();
  });
};

String.prototype.removeAttr = function(attr){
	if(attr == 'bind')
		return this.replace(/data-zha-bind\s*=\s*(\"|\')[\w.\s]*(\"|\')/ig, '');//return this.replace(/((data-zha-bind)(\s*=\s*)\"(\s*\w+.*)\")/ig, '');
	
	return this;
}

// Date format
Date.prototype.format = function(to_fmt){
	
	var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

	o_date = to_fmt.toLowerCase();
	
	o_date = o_date.replace('yyyy', this.getFullYear());
	o_date = o_date.replace('yy', new String(this.getFullYear()).substring(2,4));
	
	
	o_date = o_date.replace('mm', new String(this.getMonth()+1).lpad(2));
	o_date = o_date.replace('mon', mS[this.getMonth()]);
	
	o_date = o_date.replace('dd', new String(this.getDate()).lpad(2));
	
	if(o_date.split('ampm').length > 1){
		var hours = this.getHours();
		
		h = hours % 12;
		h = h ? h : 12; 
		o_date = o_date.replace('hh', new String(h).lpad(2));
		
		var ampm = hours >= 12 ? 'pm' : 'am';
		o_date = o_date.replace('ampm', ampm);
	}else{
		o_date = o_date.replace('hh', new String(this.getHours()).lpad(2));
	}
	
	o_date = o_date.replace('mi', new String(this.getMinutes()).lpad(2));
	o_date = o_date.replace('ss', new String(this.getSeconds()).lpad(2));
  
	return o_date;
}

Date.prototype.addDays = function(n){
	this.setDate(this.getDate() + eval(n));
	
	return this;
}

Date.prototype.addMonths = function(n){
	this.setMonth(this.getMonth() + eval(n));
	
	return this;
}
Date.prototype.dateDiff = function(d2) {
	var t2 = d2.getTime();
	var t1 = this.getTime();

	return parseInt((t2-t1)/(24*3600*1000));
}

var uzhavu ={
	'bind': function(){
			
		var e_if = document.querySelectorAll('[data-zha-if]');
		
		for(i=0;i<e_if.length;i++){
			
			if(eval(e_if[i].getAttribute('data-zha-if'))){
				this.ifBlock(e_if[i].nextElementSibling, 1);
				//e_if[i].remove();				
			}
			else{
				//e_if[i].nextElementSibling.remove();
				
				this.ifBlock(e_if[i].nextElementSibling, 0);
				e_if[i].remove();
			}
		}
		
		this.foreach();
		
		var e_bind = document.querySelectorAll('[data-zha-bind]');
		
		for(i=0;i<e_bind.length;i++){
			
			var txt = eval(e_bind[i].getAttribute('data-zha-bind'));
			
			if( typeof(txt) != 'undefined' ){ e_bind[i].innerHTML = txt;} 
		}
		
		this.show();
		this.hide();
	},
	'ifBlock':function(e, f){
		var e_next = e.nextElementSibling;
		
		if(f){
			if(e.getAttribute('data-zha-elseif') || e.getAttribute('data-zha-else') == '')e.remove();
			if(e_next) 
				if(e_next.getAttribute('data-zha-elseif') || e_next.getAttribute('data-zha-else') == '') this.ifBlock(e_next, f);
		}
		else if(e.getAttribute('data-zha-elseif')){
				
			if(eval(e.getAttribute('data-zha-elseif'))) 
				f = 1;
			else 
				e.remove();
			
			if(e_next) this.ifBlock(e_next, f);
		
		}
	},
	'foreach':function(){
		var e_each = document.querySelectorAll('[data-zha-foreach]');
		for(i=0; i<e_each.length;i++){
			if(e_each[i].getAttribute('data-zha-foreach') != ''){
				
				var tmp = e_each[i].getAttribute('data-zha-foreach').toLowerCase().split('as');
				var rows = '';
				var e_bind = e_each[i].querySelectorAll('[data-zha-bind]');
				for(j=0;j<eval(tmp[0]).length;j++){
					
					var arr = eval(tmp[0])[j];
					
					this.bindData(e_bind, tmp[1], arr);
					
					rows += e_each[i].innerHTML;
					
					//console.log(rows);
				}
				
				e_each[i].innerHTML = rows.removeAttr('bind');
				
			}
		}
		
	},
	'show':function(){
		var e_show = document.querySelectorAll('[data-zha-show]');
		for(i=0; i<e_show.length;i++)
			if(!eval(e_show[i].getAttribute('data-zha-show'))) e_show[i].style.display = 'none';
		
	},
	'hide':function(){
		var e_hide = document.querySelectorAll('[data-zha-hide]');
		for(i=0; i<e_hide.length;i++)
			if(eval(e_hide[i].getAttribute('data-zha-hide'))) e_hide[i].style.display = 'none';
		
	},
	'bindData':function(e, n, arr){
		var rows = '';
			
		for(k=0;k<e.length;k++){
			var attr = e[k].attributes;
			
			for(var i=0;i<attr.length;i++){
				 f = e[k].attributes[i].value.replace(n.trim(), 'arr');
				 
				 var txt = (/^[\w.]+$/).test(f.trim())?eval(f):f;
				
				 if( typeof(txt) != 'undefined'){ 
					if(e[k].attributes[i].name.toLowerCase() == 'data-zha-bind')
						e[k].innerHTML = txt;
					else if(typeof(txt) != 'object')
						e[k].attributes[i].value = txt;
				 } 
				
				
				// f = e[k].getAttribute('data-zha-bind').replace(n.trim(), 'arr');
				
				// var txt = eval(f);
				
				// if( typeof(txt) != 'undefined' ){ e[k].innerHTML = txt;} 
			}
		}
		
		
		return rows;
	}
}

window.onload = function(){
	uzhavu.bind();
}
