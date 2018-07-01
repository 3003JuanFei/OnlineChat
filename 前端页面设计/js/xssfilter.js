function k1(str) { 
	return str.replace(/<(script|link|style|iframe)(.|\n)*\/\1>\s*/ig,""); 
} 

function k2(str) { 
return str.replace(/<[a-z][^>]*\s*on[a-z]+\s*=[^>]+/ig,function($0,$1){ 
return $0.replace(/\s*on[a-z]+\s*=\s*("[^"]+"|'[^']+'|[^\s]+)\s*/ig,""); 
}); 
} 

function k3(str) { 
return str.replace(/<[a-z][^>]*\s*(href|src)\s*=[^>]+/ig,function($0,$1){ 
$0 = $0.replace(/&#(6[5-9]|[78][0-9]|9[0789]|1[01][0-9]|12[012]);?/g,function($0,$1){return String.fromCharCode($1);}); 
return $0.replace(/\s*(href|src)\s*=\s*("\s*(javascript|vbscript):[^"]+"|'\s*(javascript|vbscript):[^']+'|(javascript|vbscript):[^\s]+)/ig,""); 
}); 
}

function k4(str) { 
return str.replace(/<[a-z][^>]*\s*style\s*=[^>]+/ig,function($0,$1){ 
$0 = $0.replace(/&#(6[5-9]|[78][0-9]|9[0789]|1[01][0-9]|12[012]);?/g,function($0,$1){return String.fromCharCode($1);}); 
return $0.replace(/\s*style\s*=\s*("[^"]+(expression)[^"]+"|'[^']+\2[^']+'|[^\s]+\2[^\s]+)\s*/ig,""); 
}); 
}

function xssscriptreplace(str){
	return k1(k2(k3(k4(str))));
}