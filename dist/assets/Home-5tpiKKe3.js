import{j as e,A as t,f as r,e as n,B as o,i as a,X as i,h as s,M as c,I as l,D as d,H as f,Y as u,Z as m,_ as p,$ as h,K as x,G as g,v as b,a0 as y,a1 as v,a2 as j,a3 as w,a4 as k,a5 as S,p as C,a6 as T,T as O,d as z,g as A,r as E,o as M,w as W,J as P,a7 as I,P as R,s as L,t as F,a8 as B,S as _}from"./mui-core-Cag53dEp.js";import{a as H,L as Y,r as D,g as V,c as N}from"./react-vendor-CN1NTQaZ.js";import{u as U,i as $,c as X,r as q,L as G,a as K,C as J,b as Z}from"./index-y1Hc8D-w.js";import{M as Q,C as ee,E as te,b as re,c as ne,d as oe,T as ae,F as ie,I as se,e as ce,f as le}from"./mui-icons-BJILIAu9.js";import{F as de,a as fe,b as ue,c as me,d as pe,e as he,f as xe,g as ge,h as be}from"./index.esm-DLtscXBv.js";import{S as ye}from"./slick-theme-tQbJg0Az.js";const ve=()=>{const[h,x]=H.useState(!1),{t:g,i18n:b}=U(),y=[{name:"Home",link:"#hero"},{name:g("aboutUs"),link:"#about"},{name:g("services"),link:"#services"},{name:g("contactUs"),link:"#contact"},{name:g("blogPost"),link:"/blogs"}],v=e=>{b.changeLanguage(e.target.value)};return e.jsxs(t,{position:"fixed",sx:{top:0,zIndex:1e3,backgroundColor:"#1a76d2",boxShadow:"0 3px 8px rgba(0,0,0,0.2)",transition:"all 0.3s ease-in-out"},children:[e.jsxs(r,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",py:1,px:{xs:2,sm:4}},children:[e.jsx(n,{variant:"h5",sx:{display:"flex",alignItems:"center",flexGrow:1,color:"white"},children:e.jsx("img",{src:"/app/logo.jpg",alt:"BookMyWorker",style:{height:54,width:48}})}),e.jsx(o,{sx:{display:{xs:"none",md:"flex"},gap:1},children:y.map(t=>t.link.startsWith("/")?e.jsx(a,{component:Y,to:t.link,sx:{color:"#fff",textTransform:"capitalize",fontSize:"0.9rem",borderRadius:"20px",px:1.5,"&:hover":{backgroundColor:"rgba(255,255,255,0.2)"}},children:t.name},t.name):e.jsx(a,{component:"a",href:t.link,sx:{color:"#fff",textTransform:"capitalize",fontSize:"0.9rem",borderRadius:"20px",px:1.5,"&:hover":{backgroundColor:"rgba(255,255,255,0.2)"}},children:t.name},t.name))}),e.jsxs(o,{sx:{display:{xs:"none",md:"flex"},alignItems:"center",gap:1.5},children:[e.jsx(a,{variant:"outlined",href:"/login",sx:{color:"#fff",borderColor:"#fff",borderRadius:"25px",fontSize:"0.85rem",px:2,py:.5,textTransform:"capitalize",transition:"all 0.3s","&:hover":{backgroundColor:"rgba(255,255,255,0.2)",borderColor:"#fff"}},children:g("login")}),e.jsx(a,{variant:"contained",href:"/landing",sx:{backgroundColor:"#fff",color:"#1a76d2",borderRadius:"25px",fontSize:"0.85rem",px:2,py:.5,textTransform:"capitalize",fontWeight:600,"&:hover":{backgroundColor:"#e6e6e6"}},children:g("getStartedForfree")}),e.jsx(i,{size:"small",variant:"outlined",children:e.jsxs(s,{value:b.language,onChange:v,sx:{backgroundColor:"white",borderRadius:"20px",height:35,fontSize:"0.85rem",fontWeight:500,px:1},children:[e.jsx(c,{value:"en",children:"EN"}),e.jsx(c,{value:"hi",children:"हि"}),e.jsx(c,{value:"mr",children:"म"}),e.jsx(c,{value:"gu",children:"ગુ"})]})})]}),e.jsx(o,{sx:{display:{xs:"flex",md:"none"}},children:e.jsx(l,{color:"inherit",onClick:()=>x(!0),children:e.jsx(Q,{sx:{color:"#fff",fontSize:26}})})})]}),e.jsxs(d,{anchor:"right",open:h,onClose:()=>x(!1),PaperProps:{sx:{backgroundColor:"rgba(255, 255, 255, 0.97)",backdropFilter:"blur(10px)",width:"80vw",maxWidth:320,borderRadius:"12px 0 0 12px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}},children:[e.jsxs(o,{sx:{display:"flex",justifyContent:"space-between",p:2},children:[e.jsx(n,{variant:"h6",sx:{fontWeight:600,color:"#1a76d2"},children:"Menu"}),e.jsx(l,{onClick:()=>x(!1),children:e.jsx(ee,{sx:{color:"#1a76d2"}})})]}),e.jsx(f,{}),e.jsx(u,{children:y.map(t=>e.jsx(m,{button:!0,onClick:()=>x(!1),component:t.link.startsWith("/")?Y:"a",to:t.link.startsWith("/")?t.link:void 0,href:t.link.startsWith("/")?void 0:t.link,children:e.jsx(p,{primary:t.name,primaryTypographyProps:{color:"#1a76d2",fontWeight:500,fontSize:"1rem",textTransform:"capitalize"}})},t.name))}),e.jsx(f,{sx:{my:1}}),e.jsxs(o,{sx:{p:2},children:[e.jsx(a,{fullWidth:!0,variant:"outlined",href:"/login",sx:{borderColor:"#1a76d2",color:"#1a76d2",borderRadius:"25px",mb:1.5,textTransform:"capitalize",fontWeight:600},children:g("login")}),e.jsx(a,{fullWidth:!0,variant:"contained",href:"/landing",sx:{backgroundColor:"#1a76d2",color:"#fff",borderRadius:"25px",textTransform:"capitalize",fontWeight:600,"&:hover":{backgroundColor:"#155fa8"}},children:g("getStartedForfree")}),e.jsx(i,{fullWidth:!0,sx:{mt:2},children:e.jsxs(s,{value:b.language,onChange:v,sx:{backgroundColor:"#f5f5f5",borderRadius:"20px",fontSize:"0.9rem",fontWeight:500},children:[e.jsx(c,{value:"en",children:"English"}),e.jsx(c,{value:"hi",children:"हिन्दी"}),e.jsx(c,{value:"mr",children:"मराठी"}),e.jsx(c,{value:"gu",children:"ગુજરાતી"})]})})]})]})]})};var je,we;var ke=function(){if(we)return je;we=1;var e,t=D(),r=(e=t)&&"object"==typeof e&&"default"in e?e.default:e;function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var o=!("undefined"==typeof window||!window.document||!window.document.createElement);return je=function(e,a,i){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof a)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==i&&"function"!=typeof i)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(s){if("function"!=typeof s)throw new Error("Expected WrappedComponent to be a React component.");var c,l=[];function d(){c=e(l.map(function(e){return e.props})),f.canUseDOM?a(c):i&&(c=i(c))}var f=function(e){var t,n;function o(){return e.apply(this,arguments)||this}n=e,(t=o).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,o.peek=function(){return c},o.rewind=function(){if(o.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=c;return c=void 0,l=[],e};var a=o.prototype;return a.UNSAFE_componentWillMount=function(){l.push(this),d()},a.componentDidUpdate=function(){d()},a.componentWillUnmount=function(){var e=l.indexOf(this);l.splice(e,1),d()},a.render=function(){return r.createElement(s,this.props)},o}(t.PureComponent);return n(f,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(s)+")"),n(f,"canUseDOM",o),f}},je}();const Se=V(ke);
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var Ce,Te;const Oe=V(function(){if(Te)return Ce;Te=1;var e=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable;return Ce=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(o){return!1}}()?Object.assign:function(n,o){for(var a,i,s=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(n),c=1;c<arguments.length;c++){for(var l in a=Object(arguments[c]))t.call(a,l)&&(s[l]=a[l]);if(e){i=e(a);for(var d=0;d<i.length;d++)r.call(a,i[d])&&(s[i[d]]=a[i[d]])}}return s}}());var ze="bodyAttributes",Ae="htmlAttributes",Ee="titleAttributes",Me={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"};Object.keys(Me).map(function(e){return Me[e]});var We,Pe,Ie,Re,Le="charset",Fe="cssText",Be="href",_e="http-equiv",He="innerHTML",Ye="itemprop",De="name",Ve="property",Ne="rel",Ue="src",$e="target",Xe={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},qe="defaultTitle",Ge="defer",Ke="encodeSpecialCharacters",Je="onChangeClientState",Ze="titleTemplate",Qe=Object.keys(Xe).reduce(function(e,t){return e[Xe[t]]=t,e},{}),et=[Me.NOSCRIPT,Me.SCRIPT,Me.STYLE],tt="data-react-helmet",rt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},nt=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),ot=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},at=function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r},it=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},st=function(e){var t=ut(e,Me.TITLE),r=ut(e,Ze);if(r&&t)return r.replace(/%s/g,function(){return Array.isArray(t)?t.join(""):t});var n=ut(e,qe);return t||n||void 0},ct=function(e){return ut(e,Je)||function(){}},lt=function(e,t){return t.filter(function(t){return void 0!==t[e]}).map(function(t){return t[e]}).reduce(function(e,t){return ot({},e,t)},{})},dt=function(e,t){return t.filter(function(e){return void 0!==e[Me.BASE]}).map(function(e){return e[Me.BASE]}).reverse().reduce(function(t,r){if(!t.length)for(var n=Object.keys(r),o=0;o<n.length;o++){var a=n[o].toLowerCase();if(-1!==e.indexOf(a)&&r[a])return t.concat(r)}return t},[])},ft=function(e,t,r){var n={};return r.filter(function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&gt("Helmet: "+e+' should be of type "Array". Instead found type "'+rt(t[e])+'"'),!1)}).map(function(t){return t[e]}).reverse().reduce(function(e,r){var o={};r.filter(function(e){for(var r=void 0,a=Object.keys(e),i=0;i<a.length;i++){var s=a[i],c=s.toLowerCase();-1===t.indexOf(c)||r===Ne&&"canonical"===e[r].toLowerCase()||c===Ne&&"stylesheet"===e[c].toLowerCase()||(r=c),-1===t.indexOf(s)||s!==He&&s!==Fe&&s!==Ye||(r=s)}if(!r||!e[r])return!1;var l=e[r].toLowerCase();return n[r]||(n[r]={}),o[r]||(o[r]={}),!n[r][l]&&(o[r][l]=!0,!0)}).reverse().forEach(function(t){return e.push(t)});for(var a=Object.keys(o),i=0;i<a.length;i++){var s=a[i],c=Oe({},n[s],o[s]);n[s]=c}return e},[]).reverse()},ut=function(e,t){for(var r=e.length-1;r>=0;r--){var n=e[r];if(n.hasOwnProperty(t))return n[t]}return null},mt=(We=Date.now(),function(e){var t=Date.now();t-We>16?(We=t,e(t)):setTimeout(function(){mt(e)},0)}),pt=function(e){return clearTimeout(e)},ht="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||mt:global.requestAnimationFrame||mt,xt="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||pt:global.cancelAnimationFrame||pt,gt=function(e){return console&&"function"==typeof console.warn&&void 0},bt=null,yt=function(e,t){var r=e.baseTag,n=e.bodyAttributes,o=e.htmlAttributes,a=e.linkTags,i=e.metaTags,s=e.noscriptTags,c=e.onChangeClientState,l=e.scriptTags,d=e.styleTags,f=e.title,u=e.titleAttributes;wt(Me.BODY,n),wt(Me.HTML,o),jt(f,u);var m={baseTag:kt(Me.BASE,r),linkTags:kt(Me.LINK,a),metaTags:kt(Me.META,i),noscriptTags:kt(Me.NOSCRIPT,s),scriptTags:kt(Me.SCRIPT,l),styleTags:kt(Me.STYLE,d)},p={},h={};Object.keys(m).forEach(function(e){var t=m[e],r=t.newTags,n=t.oldTags;r.length&&(p[e]=r),n.length&&(h[e]=m[e].oldTags)}),t&&t(),c(e,p,h)},vt=function(e){return Array.isArray(e)?e.join(""):e},jt=function(e,t){void 0!==e&&document.title!==e&&(document.title=vt(e)),wt(Me.TITLE,t)},wt=function(e,t){var r=document.getElementsByTagName(e)[0];if(r){for(var n=r.getAttribute(tt),o=n?n.split(","):[],a=[].concat(o),i=Object.keys(t),s=0;s<i.length;s++){var c=i[s],l=t[c]||"";r.getAttribute(c)!==l&&r.setAttribute(c,l),-1===o.indexOf(c)&&o.push(c);var d=a.indexOf(c);-1!==d&&a.splice(d,1)}for(var f=a.length-1;f>=0;f--)r.removeAttribute(a[f]);o.length===a.length?r.removeAttribute(tt):r.getAttribute(tt)!==i.join(",")&&r.setAttribute(tt,i.join(","))}},kt=function(e,t){var r=document.head||document.querySelector(Me.HEAD),n=r.querySelectorAll(e+"["+tt+"]"),o=Array.prototype.slice.call(n),a=[],i=void 0;return t&&t.length&&t.forEach(function(t){var r=document.createElement(e);for(var n in t)if(t.hasOwnProperty(n))if(n===He)r.innerHTML=t.innerHTML;else if(n===Fe)r.styleSheet?r.styleSheet.cssText=t.cssText:r.appendChild(document.createTextNode(t.cssText));else{var s=void 0===t[n]?"":t[n];r.setAttribute(n,s)}r.setAttribute(tt,"true"),o.some(function(e,t){return i=t,r.isEqualNode(e)})?o.splice(i,1):a.push(r)}),o.forEach(function(e){return e.parentNode.removeChild(e)}),a.forEach(function(e){return r.appendChild(e)}),{oldTags:o,newTags:a}},St=function(e){return Object.keys(e).reduce(function(t,r){var n=void 0!==e[r]?r+'="'+e[r]+'"':""+r;return t?t+" "+n:n},"")},Ct=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce(function(t,r){return t[Xe[r]||r]=e[r],t},t)},Tt=function(e,t,r){switch(e){case Me.TITLE:return{toComponent:function(){return e=t.title,r=t.titleAttributes,(n={key:e})[tt]=!0,o=Ct(r,n),[N.createElement(Me.TITLE,o,e)];var e,r,n,o},toString:function(){return function(e,t,r,n){var o=St(r),a=vt(t);return o?"<"+e+" "+tt+'="true" '+o+">"+it(a,n)+"</"+e+">":"<"+e+" "+tt+'="true">'+it(a,n)+"</"+e+">"}(e,t.title,t.titleAttributes,r)}};case ze:case Ae:return{toComponent:function(){return Ct(t)},toString:function(){return St(t)}};default:return{toComponent:function(){return function(e,t){return t.map(function(t,r){var n,o=((n={key:r})[tt]=!0,n);return Object.keys(t).forEach(function(e){var r=Xe[e]||e;if(r===He||r===Fe){var n=t.innerHTML||t.cssText;o.dangerouslySetInnerHTML={__html:n}}else o[r]=t[e]}),N.createElement(e,o)})}(e,t)},toString:function(){return function(e,t,r){return t.reduce(function(t,n){var o=Object.keys(n).filter(function(e){return!(e===He||e===Fe)}).reduce(function(e,t){var o=void 0===n[t]?t:t+'="'+it(n[t],r)+'"';return e?e+" "+o:o},""),a=n.innerHTML||n.cssText||"",i=-1===et.indexOf(e);return t+"<"+e+" "+tt+'="true" '+o+(i?"/>":">"+a+"</"+e+">")},"")}(e,t,r)}}}},Ot=function(e){var t=e.baseTag,r=e.bodyAttributes,n=e.encode,o=e.htmlAttributes,a=e.linkTags,i=e.metaTags,s=e.noscriptTags,c=e.scriptTags,l=e.styleTags,d=e.title,f=void 0===d?"":d,u=e.titleAttributes;return{base:Tt(Me.BASE,t,n),bodyAttributes:Tt(ze,r,n),htmlAttributes:Tt(Ae,o,n),link:Tt(Me.LINK,a,n),meta:Tt(Me.META,i,n),noscript:Tt(Me.NOSCRIPT,s,n),script:Tt(Me.SCRIPT,c,n),style:Tt(Me.STYLE,l,n),title:Tt(Me.TITLE,{title:f,titleAttributes:u},n)}},zt=Se(function(e){return{baseTag:dt([Be,$e],e),bodyAttributes:lt(ze,e),defer:ut(e,Ge),encode:ut(e,Ke),htmlAttributes:lt(Ae,e),linkTags:ft(Me.LINK,[Ne,Be],e),metaTags:ft(Me.META,[De,Le,_e,Ve,Ye],e),noscriptTags:ft(Me.NOSCRIPT,[He],e),onChangeClientState:ct(e),scriptTags:ft(Me.SCRIPT,[Ue,He],e),styleTags:ft(Me.STYLE,[Fe],e),title:st(e),titleAttributes:lt(Ee,e)}},function(e){bt&&xt(bt),e.defer?bt=ht(function(){yt(e,function(){bt=null})}):(yt(e),bt=null)},Ot)(function(){return null}),At=(Pe=zt,Re=Ie=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.shouldComponentUpdate=function(e){return!$(this.props,e)},t.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case Me.SCRIPT:case Me.NOSCRIPT:return{innerHTML:t};case Me.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},t.prototype.flattenArrayTypeChildren=function(e){var t,r=e.child,n=e.arrayTypeChildren,o=e.newChildProps,a=e.nestedChildren;return ot({},n,((t={})[r.type]=[].concat(n[r.type]||[],[ot({},o,this.mapNestedChildrenToProps(r,a))]),t))},t.prototype.mapObjectTypeChildren=function(e){var t,r,n=e.child,o=e.newProps,a=e.newChildProps,i=e.nestedChildren;switch(n.type){case Me.TITLE:return ot({},o,((t={})[n.type]=i,t.titleAttributes=ot({},a),t));case Me.BODY:return ot({},o,{bodyAttributes:ot({},a)});case Me.HTML:return ot({},o,{htmlAttributes:ot({},a)})}return ot({},o,((r={})[n.type]=ot({},a),r))},t.prototype.mapArrayTypeChildrenToProps=function(e,t){var r=ot({},t);return Object.keys(e).forEach(function(t){var n;r=ot({},r,((n={})[t]=e[t],n))}),r},t.prototype.warnOnInvalidChildren=function(e,t){return!0},t.prototype.mapChildrenToProps=function(e,t){var r=this,n={};return N.Children.forEach(e,function(e){if(e&&e.props){var o=e.props,a=o.children,i=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce(function(t,r){return t[Qe[r]||r]=e[r],t},t)}(at(o,["children"]));switch(r.warnOnInvalidChildren(e,a),e.type){case Me.LINK:case Me.META:case Me.NOSCRIPT:case Me.SCRIPT:case Me.STYLE:n=r.flattenArrayTypeChildren({child:e,arrayTypeChildren:n,newChildProps:i,nestedChildren:a});break;default:t=r.mapObjectTypeChildren({child:e,newProps:t,newChildProps:i,nestedChildren:a})}}}),t=this.mapArrayTypeChildrenToProps(n,t)},t.prototype.render=function(){var e=this.props,t=e.children,r=at(e,["children"]),n=ot({},r);return t&&(n=this.mapChildrenToProps(t,n)),N.createElement(Pe,n)},nt(t,null,[{key:"canUseDOM",set:function(e){Pe.canUseDOM=e}}]),t}(N.Component),Ie.propTypes={base:h.object,bodyAttributes:h.object,children:h.oneOfType([h.arrayOf(h.node),h.node]),defaultTitle:h.string,defer:h.bool,encodeSpecialCharacters:h.bool,htmlAttributes:h.object,link:h.arrayOf(h.object),meta:h.arrayOf(h.object),noscript:h.arrayOf(h.object),onChangeClientState:h.func,script:h.arrayOf(h.object),style:h.arrayOf(h.object),title:h.string,titleAttributes:h.object,titleTemplate:h.string},Ie.defaultProps={defer:!0,encodeSpecialCharacters:!0},Ie.peek=Pe.peek,Ie.rewind=function(){var e=Pe.rewind();return e||(e=Ot({baseTag:[],bodyAttributes:{},htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},Re);At.renderStatic=At.rewind;const Et=["Every great project begins with the right hands.","Connecting skilled workers with opportunities that build the future.","Your project, our people — perfectly matched.","Building trust, one worker at a time.","From foundation to finish, we’ve got the workforce you need.","Empowering employers, uplifting workers.","Work made simple. Results made strong.","Skilled. Reliable. Ready to build.","The bridge between skill and success.","India’s workforce, just a click away."];function Mt(){return e.jsx(o,{sx:{backgroundColor:"#1976d2",color:"#fff",textAlign:"center",py:5,mt:4},children:e.jsx(ye,{dots:!0,infinite:!0,autoplay:!0,autoplaySpeed:3e3,arrows:!1,pauseOnHover:!1,children:Et.map((t,r)=>e.jsx(o,{children:e.jsx(n,{variant:"h5",sx:{color:"#fff",fontWeight:700,lineHeight:1.4,fontSize:{xs:"1.4rem",md:"2rem"},letterSpacing:"0.5px",textShadow:"0 2px 6px rgba(0,0,0,0.3)"},children:t})},r))})})}const Wt=["Your Trusted Partner in Workforce Solutions","Connecting Skill with Opportunity","Building India’s Workforce Future","Reliable Workers, On Time, Every Time","Smart Solutions for Every Job Site","Empowering Workers. Supporting Employers.","Simplifying Hiring, Amplifying Productivity","The Right Worker for Every Work Need"];function Pt(){return e.jsx(o,{sx:{py:1},children:e.jsx(ye,{dots:!1,infinite:!0,fade:!0,autoplay:!0,autoplaySpeed:3e3,arrows:!1,pauseOnHover:!1,children:Wt.map((t,r)=>e.jsx(n,{variant:"h2",sx:{fontWeight:700,color:"#0d47a1",mb:1,fontSize:{xs:"2rem",md:"3rem"},lineHeight:1.2},children:t},r))})})}const It=["/home-slide-1.jpeg","/home-slide-2.jpeg","/home-slide-3.jpeg","/home-slide-4.jpeg"],Rt={infinite:!0,speed:700,slidesToShow:1,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,arrows:!1,dots:!0,fade:!0,cssEase:"ease-in-out"},Lt=({end:t,duration:r=2e3})=>{const[o,a]=H.useState(0);return H.useEffect(()=>{let e=0;const n=t/(r/50),o=setInterval(()=>{e+=n,e>=t&&(e=t,clearInterval(o)),a(Math.floor(e))},50);return()=>clearInterval(o)},[t,r]),e.jsxs(n,{variant:"h6",fontWeight:600,color:"primary",children:[o,"+"]})},Ft=()=>{const{t:t}=U(),r=[{icon:e.jsx(de,{size:28,color:"#1976d2"}),title:t("activeWorkersTitle"),value:12e4,desc:t("activeWorkersDesc")},{icon:e.jsx(fe,{size:28,color:"#388e3c"}),title:t("workerAgentsTitle"),value:6e3,desc:t("workerAgentsDesc")},{icon:e.jsx(ue,{size:28,color:"#f57c00"}),title:t("employersTitle"),value:420,desc:t("employersDesc")},{icon:e.jsx(me,{size:28,color:"#6a1b9a"}),title:t("industriesTitle"),value:75,desc:t("industriesDesc")}];return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/hero"})]}),e.jsxs(o,{id:"hero",sx:{background:"linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 50%, #fff3e0 100%)",position:"relative",overflow:"visible",pt:{xs:10,md:9},pb:{xs:12,md:16}},children:[e.jsx(o,{sx:{position:"absolute",width:300,height:300,background:"radial-gradient(circle, rgba(33,150,243,0.2), transparent 70%)",borderRadius:"50%",top:"-10%",left:"-10%",zIndex:0,animation:"float 8s ease-in-out infinite alternate","@keyframes float":{"0%":{transform:"translateY(0)"},"50%":{transform:"translateY(-15px) translateX(10px) rotate(5deg)"},"100%":{transform:"translateY(0)"}}}}),e.jsx(o,{sx:{position:"absolute",width:300,height:300,background:"radial-gradient(circle, rgba(76,175,80,0.2), transparent 70%)",borderRadius:"50%",bottom:"-10%",right:"-10%",zIndex:0,animation:"float2 10s ease-in-out infinite alternate","@keyframes float2":{"0%":{transform:"translateY(0)"},"50%":{transform:"translateY(15px) translateX(-10px) rotate(-5deg)"},"100%":{transform:"translateY(0)"}}}}),e.jsx(x,{maxWidth:!1,disableGutters:!0,sx:{px:{xs:2,sm:3,md:4},py:{xs:4,md:6},position:"relative",zIndex:1,overflow:"hidden",borderBottomLeftRadius:{xs:"40px",md:"80px"},borderBottomRightRadius:{xs:"40px",md:"80px"},boxShadow:"0 10px 25px rgba(0, 0, 0, 0.08)"},children:e.jsxs(g,{container:!0,spacing:4,alignItems:"center",children:[e.jsx(g,{item:!0,xs:12,md:6,children:e.jsxs(o,{"data-aos":"fade-right",children:[e.jsxs(o,{display:"flex",alignItems:"center",mb:1,children:[e.jsx(te,{sx:{mr:1,color:"#1976d2"}}),e.jsx(n,{variant:"body2",color:"text.secondary",children:"Working for your success"})]}),e.jsx(Pt,{}),e.jsxs(n,{variant:"body1",sx:{mb:2,color:"text.secondary",fontSize:"1.05rem"},children:[e.jsx("span",{style:{color:"#1976d2",fontWeight:"bold"},children:"BookMyWorker"})," ",t("heroSubheading")]}),e.jsx(n,{variant:"body1",sx:{mb:2,color:"text.secondary",fontSize:"1.05rem"},children:t("heromsg")}),e.jsxs(o,{sx:{display:"flex",flexWrap:"wrap",gap:1.5},children:[e.jsx(a,{variant:"contained",size:"medium",href:"/register",sx:{background:"linear-gradient(90deg, #1976d2, #42a5f5)",color:"#fff",textTransform:"capitalize",borderRadius:3,px:3,boxShadow:"0 4px 12px rgba(25,118,210,0.35)",transition:"all 0.3s ease","&:hover":{background:"linear-gradient(90deg, #1565c0, #1e88e5)",transform:"scale(1.05)"}},children:t("getStartedForfree")}),e.jsx(a,{variant:"outlined",startIcon:e.jsx(pe,{}),href:"https://wa.me/15557193421",target:"_blank",sx:{borderColor:"#25D366",color:"#25D366",textTransform:"capitalize",borderRadius:3,px:3,transition:"all 0.3s ease","&:hover":{backgroundColor:"#eafff1",borderColor:"#1ebe5d",transform:"scale(1.05)"}},children:t("whatsappNow")}),e.jsx(a,{variant:"outlined",size:"large",startIcon:e.jsx(he,{}),href:"https://play.google.com/store/apps/details?id=com.app.myworker",target:"_blank",sx:{borderColor:"#34A853",color:"#34A853",textTransform:"capitalize",borderRadius:3,transition:"all 0.3s ease","&:hover":{backgroundColor:"#e8f5e9",borderColor:"#2c8c47",transform:"scale(1.05)"}},children:t("downloadApp")})]})]})}),e.jsx(g,{item:!0,xs:12,md:6,children:e.jsx(o,{sx:{borderRadius:3,overflow:"hidden",boxShadow:"0 10px 35px rgba(0,0,0,0.2)",transform:"translateY(0)",animation:"float 6s ease-in-out infinite","@keyframes float":{"0%, 100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-12px)"}}},children:e.jsx(ye,{...Rt,children:It.map((t,r)=>e.jsx(b,{sx:{borderRadius:3,transition:"transform 0.5s","&:hover":{transform:"scale(1.03) rotate(-0.5deg)"}},children:e.jsx(y,{component:"img",image:t,alt:`slide-${r}`,sx:{width:"100%",height:{xs:280,md:360},objectFit:"cover"}})},r))})})})]})}),e.jsx(Mt,{}),e.jsx(x,{children:e.jsx(g,{container:!0,spacing:2,justifyContent:"center",sx:{mt:6},children:r.map((t,r)=>e.jsx(g,{item:!0,xs:6,sm:3,children:e.jsxs(b,{sx:{textAlign:"center",py:2.5,px:1.5,borderRadius:3,backdropFilter:"blur(10px)",background:"rgba(255,255,255,0.65)",boxShadow:"0 6px 20px rgba(0,0,0,0.12)",transition:"all 0.3s ease",height:180,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center","&:hover":{transform:"translateY(-5px)",boxShadow:"0 10px 30px rgba(0,0,0,0.2)"}},children:[e.jsx(o,{mb:1.5,children:t.icon}),e.jsx(Lt,{end:t.value}),e.jsx(n,{variant:"body2",color:"text.secondary",children:t.desc})]})},r))})}),e.jsx(o,{sx:{position:"absolute",bottom:0,left:0,width:"100%",overflow:"hidden",lineHeight:0,zIndex:0},children:e.jsx("svg",{viewBox:"0 0 1440 120",preserveAspectRatio:"none",style:{width:"100%",height:100,display:"block"},children:e.jsx("path",{d:"M0,40 C360,100 1080,0 1440,60 L1440,120 L0,120 Z",style:{fill:"rgb(50 147 232)"}})})})]})]})},Bt=()=>{const{t:t}=U(),r=[t("about1"),t("about2"),t("about3")],a=[t("about4"),t("about5"),t("about6")];return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"About Us: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/about"})]}),e.jsxs(o,{id:"about",sx:{position:"relative",overflow:"hidden",backgroundColor:"#f9fafb",pt:{xs:8,md:10}},children:[e.jsx(x,{maxWidth:!1,disableGutters:!0,"data-aos":"fade-up","data-aos-delay":"100",sx:{px:{xs:2,sm:3,md:4},position:"relative",zIndex:1},children:e.jsxs(g,{container:!0,spacing:6,alignItems:"center",children:[e.jsxs(g,{item:!0,xs:12,md:7,children:[e.jsx(n,{variant:"h4",sx:{fontWeight:700,mb:3,color:"#0d47a1"},children:t("aboutUs")}),e.jsxs(n,{variant:"body1",sx:{mb:2,fontSize:"1rem",color:"#555"},children:[e.jsx("strong",{children:"BookMyWorker"})," ",t("aboutDescription")]}),e.jsx(n,{variant:"body1",sx:{mb:2,fontSize:"1rem",color:"#555"},children:t("aboutDescription1")})," ",e.jsx(n,{variant:"body1",sx:{mb:2,fontSize:"1rem",color:"#555"},children:t("aboutDescription2")})," ",e.jsx(n,{variant:"body1",sx:{mb:2,fontSize:"1rem",color:"#555"},children:t("aboutDescription3")}),e.jsx(g,{container:!0,spacing:3,children:[r,a].map((t,r)=>e.jsx(g,{item:!0,xs:6,children:e.jsx(u,{children:t.map((t,r)=>e.jsxs(m,{sx:{px:0,mb:2,background:"white",borderRadius:2,boxShadow:"0 6px 20px rgba(0,0,0,0.08)",transition:"transform 0.3s, box-shadow 0.3s","&:hover":{transform:"translateY(-5px)",boxShadow:"0 12px 25px rgba(0,0,0,0.15)"}},children:[e.jsx(v,{sx:{minWidth:"35px"},children:e.jsx(re,{color:"primary",sx:{fontSize:22}})}),e.jsx(n,{variant:"body1",sx:{color:"#444"},children:t})]},r))})},r))})]}),e.jsx(g,{item:!0,xs:12,md:5,children:e.jsxs(o,{sx:{position:"relative",borderRadius:3,overflow:"hidden",boxShadow:"0 10px 30px rgba(0,0,0,0.15)","& img.main":{borderRadius:"12px"}},children:[e.jsx("img",{src:"/assets/images/about-us-1.png",alt:"Business Meeting",className:"main",style:{width:"100%",height:"100%",objectFit:"cover"}}),e.jsxs(o,{sx:{position:"absolute",top:16,left:16,backgroundColor:"white",px:2.5,py:1.5,borderRadius:3,boxShadow:"0 6px 20px rgba(0,0,0,0.15)",textAlign:"center",animation:"pulse 2s infinite","@keyframes pulse":{"0%,100%":{transform:"scale(1)"},"50%":{transform:"scale(1.05)"}}},children:[e.jsxs(n,{variant:"h5",sx:{fontWeight:700,lineHeight:1},children:["5+"," ",e.jsx(n,{component:"span",sx:{fontSize:14},children:"Years"})]}),e.jsx(n,{variant:"body2",color:"text.secondary",children:t("workfocesolution")})]}),e.jsx(o,{component:"img",src:"/assets/images/worker-overlay.png",alt:"Worker Team",sx:{position:"absolute",bottom:-20,right:-20,width:"45%",borderRadius:2,boxShadow:"0 8px 25px rgba(0,0,0,0.18)",transform:"rotate(-5deg)"}})]})})]})}),e.jsx(o,{sx:{mt:6},children:e.jsx("svg",{viewBox:"0 0 1440 120",preserveAspectRatio:"none",style:{width:"100%",height:100,display:"block"},children:e.jsx("path",{d:"M0,0 C480,120 960,0 1440,120 L1440,0 L0,0 Z",style:{fill:"rgb(50, 147, 232)"}})})})]})]})};var _t=e.Fragment,Ht=function(t,r,n){return j.call(r,"css")?e.jsx(w,k(t,r),n):e.jsx(t,r,n)},Yt=Object.defineProperty,Dt=(e,t,r)=>((e,t,r)=>t in e?Yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r)(e,"symbol"!=typeof t?t+"":t,r),Vt=new Map,Nt=new WeakMap,Ut=0;function $t(e){return Object.keys(e).sort().filter(t=>void 0!==e[t]).map(t=>{return`${t}_${"root"===t?(r=e.root,r?(Nt.has(r)||(Ut+=1,Nt.set(r,Ut.toString())),Nt.get(r)):"0"):e[t]}`;var r}).toString()}function Xt(e,t,r={},n=undefined){if(void 0===window.IntersectionObserver&&void 0!==n){const o=e.getBoundingClientRect();return t(n,{isIntersecting:n,target:e,intersectionRatio:"number"==typeof r.threshold?r.threshold:0,time:0,boundingClientRect:o,intersectionRect:o,rootBounds:o}),()=>{}}const{id:o,observer:a,elements:i}=function(e){const t=$t(e);let r=Vt.get(t);if(!r){const n=new Map;let o;const a=new IntersectionObserver(t=>{t.forEach(t=>{var r;const a=t.isIntersecting&&o.some(e=>t.intersectionRatio>=e);e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=a),null==(r=n.get(t.target))||r.forEach(e=>{e(a,t)})})},e);o=a.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),r={id:t,observer:a,elements:n},Vt.set(t,r)}return r}(r),s=i.get(e)||[];return i.has(e)||i.set(e,s),s.push(t),a.observe(e),function(){s.splice(s.indexOf(t),1),0===s.length&&(i.delete(e),a.unobserve(e)),0===i.size&&(a.disconnect(),Vt.delete(o))}}var qt=class extends H.Component{constructor(e){super(e),Dt(this,"node",null),Dt(this,"_unobserveCb",null),Dt(this,"handleNode",e=>{this.node&&(this.unobserve(),e||this.props.triggerOnce||this.props.skip||this.setState({inView:!!this.props.initialInView,entry:void 0})),this.node=e||null,this.observeNode()}),Dt(this,"handleChange",(e,t)=>{e&&this.props.triggerOnce&&this.unobserve(),function(e){return"function"!=typeof e.children}(this.props)||this.setState({inView:e,entry:t}),this.props.onChange&&this.props.onChange(e,t)}),this.state={inView:!!e.initialInView,entry:void 0}}componentDidMount(){this.unobserve(),this.observeNode()}componentDidUpdate(e){e.rootMargin===this.props.rootMargin&&e.root===this.props.root&&e.threshold===this.props.threshold&&e.skip===this.props.skip&&e.trackVisibility===this.props.trackVisibility&&e.delay===this.props.delay||(this.unobserve(),this.observeNode())}componentWillUnmount(){this.unobserve()}observeNode(){if(!this.node||this.props.skip)return;const{threshold:e,root:t,rootMargin:r,trackVisibility:n,delay:o,fallbackInView:a}=this.props;this._unobserveCb=Xt(this.node,this.handleChange,{threshold:e,root:t,rootMargin:r,trackVisibility:n,delay:o},a)}unobserve(){this._unobserveCb&&(this._unobserveCb(),this._unobserveCb=null)}render(){const{children:e}=this.props;if("function"==typeof e){const{inView:t,entry:r}=this.state;return e({inView:t,entry:r,ref:this.handleNode})}const{as:t,triggerOnce:r,threshold:n,root:o,rootMargin:a,onChange:i,skip:s,trackVisibility:c,delay:l,initialInView:d,fallbackInView:f,...u}=this.props;return H.createElement(t||"div",{ref:this.handleNode,...u},e)}};function Gt({threshold:e,delay:t,trackVisibility:r,rootMargin:n,root:o,triggerOnce:a,skip:i,initialInView:s,fallbackInView:c,onChange:l}={}){var d;const[f,u]=H.useState(null),m=H.useRef(l),[p,h]=H.useState({inView:!!s,entry:void 0});m.current=l,H.useEffect(()=>{if(i||!f)return;let s;return s=Xt(f,(e,t)=>{h({inView:e,entry:t}),m.current&&m.current(e,t),t.isIntersecting&&a&&s&&(s(),s=void 0)},{root:o,rootMargin:n,threshold:e,trackVisibility:r,delay:t},c),()=>{s&&s()}},[Array.isArray(e)?e.toString():e,f,o,n,a,i,r,c,t]);const x=null==(d=p.entry)?void 0:d.target,g=H.useRef(void 0);f||!x||a||i||g.current===x||(g.current=x,h({inView:!!s,entry:void 0}));const b=[u,p.inView,p.entry];return b.ref=b[0],b.inView=b[1],b.entry=b[2],b}var Kt,Jt,Zt={exports:{}},Qt={};var er=(Jt||(Jt=1,Zt.exports=function(){if(Kt)return Qt;Kt=1;var e,t=Symbol.for("react.element"),r=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),i=Symbol.for("react.provider"),s=Symbol.for("react.context"),c=Symbol.for("react.server_context"),l=Symbol.for("react.forward_ref"),d=Symbol.for("react.suspense"),f=Symbol.for("react.suspense_list"),u=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),p=Symbol.for("react.offscreen");function h(e){if("object"==typeof e&&null!==e){var p=e.$$typeof;switch(p){case t:switch(e=e.type){case n:case a:case o:case d:case f:return e;default:switch(e=e&&e.$$typeof){case c:case s:case l:case m:case u:case i:return e;default:return p}}case r:return p}}}return e=Symbol.for("react.module.reference"),Qt.ContextConsumer=s,Qt.ContextProvider=i,Qt.Element=t,Qt.ForwardRef=l,Qt.Fragment=n,Qt.Lazy=m,Qt.Memo=u,Qt.Portal=r,Qt.Profiler=a,Qt.StrictMode=o,Qt.Suspense=d,Qt.SuspenseList=f,Qt.isAsyncMode=function(){return!1},Qt.isConcurrentMode=function(){return!1},Qt.isContextConsumer=function(e){return h(e)===s},Qt.isContextProvider=function(e){return h(e)===i},Qt.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===t},Qt.isForwardRef=function(e){return h(e)===l},Qt.isFragment=function(e){return h(e)===n},Qt.isLazy=function(e){return h(e)===m},Qt.isMemo=function(e){return h(e)===u},Qt.isPortal=function(e){return h(e)===r},Qt.isProfiler=function(e){return h(e)===a},Qt.isStrictMode=function(e){return h(e)===o},Qt.isSuspense=function(e){return h(e)===d},Qt.isSuspenseList=function(e){return h(e)===f},Qt.isValidElementType=function(t){return"string"==typeof t||"function"==typeof t||t===n||t===a||t===o||t===d||t===f||t===p||"object"==typeof t&&null!==t&&(t.$$typeof===m||t.$$typeof===u||t.$$typeof===i||t.$$typeof===s||t.$$typeof===l||t.$$typeof===e||void 0!==t.getModuleId)},Qt.typeOf=h,Qt}()),Zt.exports);C`
  from,
  20%,
  53%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0) scaleY(1.1);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0) scaleY(1.05);
  }

  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
`,C`
  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
`,C`
  0% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-6px) rotateY(-9deg);
  }

  18.5% {
    transform: translateX(5px) rotateY(7deg);
  }

  31.5% {
    transform: translateX(-3px) rotateY(-5deg);
  }

  43.5% {
    transform: translateX(2px) rotateY(3deg);
  }

  50% {
    transform: translateX(0);
  }
`,C`
  0% {
    transform: scale(1);
  }

  14% {
    transform: scale(1.3);
  }

  28% {
    transform: scale(1);
  }

  42% {
    transform: scale(1.3);
  }

  70% {
    transform: scale(1);
  }
`,C`
  from,
  11.1%,
  to {
    transform: translate3d(0, 0, 0);
  }

  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }

  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }

  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }

  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
`,C`
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
`,C`
  from {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
`,C`
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
`,C`
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
`,C`
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(0, -10px, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(0, 10px, 0);
  }
`,C`
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
`,C`
  from {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
`,C`
  from {
    transform: translate3d(0, 0, 0);
  }

  15% {
    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
  }

  30% {
    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
  }

  45% {
    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
  }

  60% {
    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
  }

  75% {
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`;const tr=C`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`,rr=C`
  from {
    opacity: 0;
    transform: translate3d(-100%, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,nr=C`
  from {
    opacity: 0;
    transform: translate3d(100%, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,or=C`
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,ar=C`
  from {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,ir=C`
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,sr=C`
  from {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,cr=C`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,lr=C`
  from {
    opacity: 0;
    transform: translate3d(2000px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,dr=C`
  from {
    opacity: 0;
    transform: translate3d(-100%, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,fr=C`
  from {
    opacity: 0;
    transform: translate3d(100%, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,ur=C`
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,mr=C`
  from {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;function pr(e,t){return r=>r?e():t()}function hr(e){return pr(e,()=>null)}function xr(e){return hr(()=>({opacity:0}))(e)}const gr=e=>{const{cascade:t=!1,damping:r=.5,delay:n=0,duration:o=1e3,fraction:a=0,keyframes:i=ir,triggerOnce:s=!1,className:c,style:l,childClassName:d,childStyle:f,children:u,onVisibilityChange:m}=e,p=H.useMemo(()=>function({duration:e=1e3,delay:t=0,timingFunction:r="ease",keyframes:n=ir,iterationCount:o=1}){return T`
    animation-duration: ${e}ms;
    animation-timing-function: ${r};
    animation-delay: ${t}ms;
    animation-name: ${n};
    animation-direction: normal;
    animation-fill-mode: both;
    animation-iteration-count: ${o};

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `}({keyframes:i,duration:o}),[o,i]);return null==u?null:"string"==typeof(h=u)||"number"==typeof h||"boolean"==typeof h?Ht(yr,{...e,animationStyles:p,children:String(u)}):er.isFragment(u)?Ht(vr,{...e,animationStyles:p}):Ht(_t,{children:H.Children.map(u,(i,u)=>{if(!H.isValidElement(i))return null;const h=n+(t?u*o*r:0);switch(i.type){case"ol":case"ul":return Ht(S,{children:({cx:t})=>Ht(i.type,{...i.props,className:t(c,i.props.className),style:Object.assign({},l,i.props.style),children:Ht(gr,{...e,children:i.props.children})})});case"li":return Ht(qt,{threshold:a,triggerOnce:s,onChange:m,children:({inView:e,ref:t})=>Ht(S,{children:({cx:r})=>Ht(i.type,{...i.props,ref:t,className:r(d,i.props.className),css:hr(()=>p)(e),style:Object.assign({},f,i.props.style,xr(!e),{animationDelay:h+"ms"})})})});default:return Ht(qt,{threshold:a,triggerOnce:s,onChange:m,children:({inView:e,ref:t})=>Ht("div",{ref:t,className:c,css:hr(()=>p)(e),style:Object.assign({},l,xr(!e),{animationDelay:h+"ms"}),children:Ht(S,{children:({cx:e})=>Ht(i.type,{...i.props,className:e(d,i.props.className),style:Object.assign({},f,i.props.style)})})})})}})});var h},br={display:"inline-block",whiteSpace:"pre"},yr=e=>{const{animationStyles:t,cascade:r=!1,damping:n=.5,delay:o=0,duration:a=1e3,fraction:i=0,triggerOnce:s=!1,className:c,style:l,children:d,onVisibilityChange:f}=e,{ref:u,inView:m}=Gt({triggerOnce:s,threshold:i,onChange:f});return pr(()=>Ht("div",{ref:u,className:c,style:Object.assign({},l,br),children:d.split("").map((e,r)=>Ht("span",{css:hr(()=>t)(m),style:{animationDelay:o+r*a*n+"ms"},children:e},r))}),()=>Ht(vr,{...e,children:d}))(r)},vr=e=>{const{animationStyles:t,fraction:r=0,triggerOnce:n=!1,className:o,style:a,children:i,onVisibilityChange:s}=e,{ref:c,inView:l}=Gt({triggerOnce:n,threshold:r,onChange:s});return Ht("div",{ref:c,className:o,css:hr(()=>t)(l),style:Object.assign({},a,xr(!l)),children:i})};C`
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
`,C`
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0) scaleY(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, -10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, 5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,C`
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0) scaleX(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0) scaleX(1);
  }

  75% {
    transform: translate3d(-10px, 0, 0) scaleX(0.98);
  }

  90% {
    transform: translate3d(5px, 0, 0) scaleX(0.995);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,C`
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0) scaleX(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0) scaleX(1);
  }

  75% {
    transform: translate3d(10px, 0, 0) scaleX(0.98);
  }

  90% {
    transform: translate3d(-5px, 0, 0) scaleX(0.995);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,C`
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0) scaleY(5);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, 10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, -5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,C`
  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  50%,
  55% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
`,C`
  20% {
    transform: translate3d(0, 10px, 0) scaleY(0.985);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, -20px, 0) scaleY(0.9);
  }

  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0) scaleY(3);
  }
`,C`
  20% {
    opacity: 1;
    transform: translate3d(20px, 0, 0) scaleX(0.9);
  }

  to {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0) scaleX(2);
  }
`,C`
  20% {
    opacity: 1;
    transform: translate3d(-20px, 0, 0) scaleX(0.9);
  }

  to {
    opacity: 0;
    transform: translate3d(2000px, 0, 0) scaleX(2);
  }
`,C`
  20% {
    transform: translate3d(0, -10px, 0) scaleY(0.985);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, 20px, 0) scaleY(0.9);
  }

  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0) scaleY(3);
  }
`;const jr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`,wr=C`
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(-100%, 100%, 0);
  }
`,kr=C`
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(100%, 100%, 0);
  }
`,Sr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
`,Cr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
`,Tr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
`,Or=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }
`,zr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
`,Ar=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(2000px, 0, 0);
  }
`,Er=C`
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(-100%, -100%, 0);
  }
`,Mr=C`
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(100%, -100%, 0);
  }
`,Wr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
`,Pr=C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
`;const Ir=e=>{const{big:t=!1,direction:r,reverse:n=!1,...o}=e,a=H.useMemo(()=>function(e,t,r){switch(r){case"bottom-left":return t?wr:rr;case"bottom-right":return t?kr:nr;case"down":return e?t?Cr:ar:t?Sr:or;case"left":return e?t?Or:sr:t?Tr:ir;case"right":return e?t?Ar:lr:t?zr:cr;case"top-left":return t?Er:dr;case"top-right":return t?Mr:fr;case"up":return e?t?Pr:mr:t?Wr:ur;default:return t?jr:tr}}(t,n,r),[t,r,n]);return Ht(gr,{keyframes:a,...o})};C`
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
  }

  40% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
  }

  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
  }

  80% {
    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }

  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }
`,C`
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
`,C`
  from {
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
`,C`
  from {
    transform: perspective(400px);
  }

  30% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }

  to {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
`,C`
  from {
    transform: perspective(400px);
  }

  30% {
    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);
    opacity: 1;
  }

  to {
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    opacity: 0;
  }
`,C`
  0% {
    animation-timing-function: ease-in-out;
  }

  20%,
  60% {
    transform: rotate3d(0, 0, 1, 80deg);
    animation-timing-function: ease-in-out;
  }

  40%,
  80% {
    transform: rotate3d(0, 0, 1, 60deg);
    animation-timing-function: ease-in-out;
    opacity: 1;
  }

  to {
    transform: translate3d(0, 700px, 0);
    opacity: 0;
  }
`,C`
  from {
    opacity: 0;
    transform: scale(0.1) rotate(30deg);
    transform-origin: center bottom;
  }

  50% {
    transform: rotate(-10deg);
  }

  70% {
    transform: rotate(3deg);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`,C`
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);
  }
`,C`
  from {
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`,C`
  from {
    transform: rotate3d(0, 0, 1, -45deg);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`,C`
  from {
    transform: rotate3d(0, 0, 1, 45deg);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`,C`
  from {
    transform: rotate3d(0, 0, 1, 45deg);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`,C`
  from {
    transform: rotate3d(0, 0, 1, -90deg);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, 200deg);
    opacity: 0;
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, 45deg);
    opacity: 0;
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, -45deg);
    opacity: 0;
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, -45deg);
    opacity: 0;
  }
`,C`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, 90deg);
    opacity: 0;
  }
`;const Rr=C`
  from {
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,Lr=C`
  from {
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,Fr=C`
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,Br=C`
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`,_r=C`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
  }
`,Hr=C`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(-100%, 0, 0);
  }
`,Yr=C`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
`,Dr=C`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, -100%, 0);
  }
`;const Vr=e=>{const{direction:t,reverse:r=!1,...n}=e,o=H.useMemo(()=>function(e,t){switch(t){case"down":return e?_r:Rr;case"right":return e?Yr:Fr;case"up":return e?Dr:Br;default:return e?Hr:Lr}}(r,t),[t,r]);return Ht(gr,{keyframes:o,...n})};C`
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
`,C`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`,C`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`,C`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`,C`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`,C`
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  to {
    opacity: 0;
  }
`,C`
  40% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  to {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`,C`
  40% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);
  }

  to {
    opacity: 0;
    transform: scale(0.1) translate3d(-2000px, 0, 0);
  }
`,C`
  40% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);
  }

  to {
    opacity: 0;
    transform: scale(0.1) translate3d(2000px, 0, 0);
  }
`,C`
  40% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  to {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`;const Nr=()=>{const[t,r]=N.useState(0),{t:i}=U();i("agentFaqs",{returnObjects:!0}),i("employerFaqs",{returnObjects:!0});const s=[{title:i("featureTab1Title"),desc:i("featureTab1Desc"),points:[i("featureTab1Point1"),i("featureTab1Point2"),i("featureTab1Point3"),i("featureTab1Point4"),i("featureTab1Point5")],img:`${X.API_BASE_URL}/assets/img/worker1.jpg`},{title:i("featureTab2Title"),desc:i("featureTab2Desc"),points:[i("featureTab2Point1"),i("featureTab2Point2"),i("featureTab2Point3"),i("featureTab2Point4")],img:"semiskilled.png"},{title:i("featureTab3Title"),desc:i("featureTab3Desc"),points:[i("featureTab3Point1"),i("featureTab3Point2"),i("featureTab3Point3"),i("featureTab3Point4")],img:`${X.API_BASE_URL}/assets/img/grouplaber.jpg`}];return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/feature"})]}),e.jsx(o,{id:"features",sx:{py:4,background:"linear-gradient(135deg, #f9f9f9, #e0f7fa)"},children:e.jsxs(x,{maxWidth:!1,disableGutters:!0,"data-aos":"fade-up","data-aos-delay":"100",sx:{px:{xs:2,sm:3,md:6}},children:[e.jsxs(Ir,{cascade:!0,children:[e.jsx(n,{variant:"h4",align:"center",gutterBottom:!0,sx:{fontWeight:700,mb:2},children:i("workforceCategory")}),e.jsx(n,{variant:"body1",align:"center",mb:6,color:"text.secondary",children:i("catheading")})]}),e.jsx(o,{sx:{display:"flex",justifyContent:"center",mb:6},children:e.jsxs(O,{value:t,onChange:(e,t)=>{r(t)},variant:"scrollable",scrollButtons:"auto",textColor:"primary",indicatorColor:"primary",children:[e.jsx(z,{label:i("skilled")}),e.jsx(z,{label:i("semiskilled")}),e.jsx(z,{label:i("unskilled")})]})}),s.map((r,a)=>e.jsx(Vr,{direction:"up",triggerOnce:!0,cascade:!0,style:{display:t===a?"block":"none",marginBottom:60},children:e.jsxs(g,{container:!0,spacing:4,alignItems:"center",children:[e.jsx(g,{item:!0,xs:12,lg:6,children:e.jsxs(o,{children:[e.jsx(n,{variant:"h5",sx:{fontWeight:700,mb:1},children:r.title}),e.jsx(n,{variant:"body1",sx:{fontStyle:"italic",mb:2},children:r.desc}),e.jsx(u,{children:r.points.map((t,r)=>e.jsxs(m,{sx:{mb:1},children:[e.jsx(v,{children:e.jsx(re,{color:"primary"})}),e.jsx(n,{variant:"body1",children:t})]},r))})]})}),e.jsx(g,{item:!0,xs:12,lg:6,sx:{display:"flex",justifyContent:"center"},children:e.jsx(b,{sx:{borderRadius:3,overflow:"hidden",boxShadow:"0 10px 30px rgba(0,0,0,0.12)",transition:"transform 0.3s","&:hover":{transform:"translateY(-5px)"}},children:e.jsx("img",{src:r.img,alt:r.title,style:{width:"100%",borderRadius:"8px",objectFit:"cover"}})})})]})},a))]})}),e.jsx(o,{sx:{py:4,background:"#e0f2f1"},children:e.jsx(x,{maxWidth:!1,disableGutters:!0,sx:{px:{xs:2,sm:3,md:6}},children:e.jsx(g,{container:!0,spacing:4,children:[{title:i("workerAgent"),desc:i("workerAgentDescription"),icon:"👷‍♂️",link:"/register"},{title:i("employer"),desc:i("employerDescription"),icon:"🏢",link:"/register"}].map((t,r)=>e.jsx(g,{item:!0,xs:12,md:6,children:e.jsxs(b,{sx:{p:4,borderRadius:3,background:"linear-gradient(135deg, #fff, #e3f7f2)",boxShadow:"0 10px 30px rgba(0,0,0,0.12)",transition:"all 0.3s ease","&:hover":{transform:"translateY(-5px)",boxShadow:"0 15px 40px rgba(0,0,0,0.2)"}},children:[e.jsx(A,{sx:{bgcolor:"primary.main",width:72,height:72,mb:3,fontSize:32},children:t.icon}),e.jsx(n,{variant:"h5",fontWeight:"700",gutterBottom:!0,children:t.title}),e.jsx(n,{variant:"body1",mb:3,color:"text.secondary",children:t.desc}),e.jsx(a,{variant:"contained",href:t.link,sx:{px:5,py:1.5,borderRadius:"25px",fontWeight:700,background:"linear-gradient(to right, #00c6ff, #0072ff)",color:"#fff","&:hover":{background:"linear-gradient(to right, #0072ff, #00c6ff)"}},children:i("registerNow")})]})},r))})})})]})};var Ur,$r={};function Xr(){if(Ur)return $r;Ur=1;var e=E();Object.defineProperty($r,"__esModule",{value:!0}),$r.default=void 0;var t=e(q()),r=M();return $r.default=(0,t.default)((0,r.jsx)("path",{d:"m13.7826 15.1719 2.1213-2.1213 5.9963 5.9962-2.1213 2.1213zM17.5 10c1.93 0 3.5-1.57 3.5-3.5 0-.58-.16-1.12-.41-1.6l-2.7 2.7-1.49-1.49 2.7-2.7c-.48-.25-1.02-.41-1.6-.41C15.57 3 14 4.57 14 6.5c0 .41.08.8.21 1.16l-1.85 1.85-1.78-1.78.71-.71-1.41-1.41L12 3.49c-1.17-1.17-3.07-1.17-4.24 0L4.22 7.03l1.41 1.41H2.81l-.71.71 3.54 3.54.71-.71V9.15l1.41 1.41.71-.71 1.78 1.78-7.41 7.41 2.12 2.12L16.34 9.79c.36.13.75.21 1.16.21"}),"Construction"),$r}const qr=V(Xr());var Gr,Kr={};function Jr(){if(Gr)return Kr;Gr=1;var e=E();Object.defineProperty(Kr,"__esModule",{value:!0}),Kr.default=void 0;var t=e(q()),r=M();return Kr.default=(0,t.default)([(0,r.jsx)("path",{d:"M21 14c0-.55-.45-1-1-1h-2v2h2c.55 0 1-.45 1-1m-1 3h-2v2h2c.55 0 1-.45 1-1s-.45-1-1-1m-8-3h-2v4h2c0 1.1.9 2 2 2h3v-8h-3c-1.1 0-2 .9-2 2"},"0"),(0,r.jsx)("path",{d:"M5 13c0-1.1.9-2 2-2h1.5c1.93 0 3.5-1.57 3.5-3.5S10.43 4 8.5 4H5c-.55 0-1 .45-1 1s.45 1 1 1h3.5c.83 0 1.5.67 1.5 1.5S9.33 9 8.5 9H7c-2.21 0-4 1.79-4 4s1.79 4 4 4h2v-2H7c-1.1 0-2-.9-2-2"},"1")],"ElectricalServices"),Kr}const Zr=V(Jr());var Qr,en={};function tn(){if(Qr)return en;Qr=1;var e=E();Object.defineProperty(en,"__esModule",{value:!0}),en.default=void 0;var t=e(q()),r=M();return en.default=(0,t.default)([(0,r.jsx)("path",{d:"m19.28 4.93-2.12-2.12c-.78-.78-2.05-.78-2.83 0L11.5 5.64l2.12 2.12 2.12-2.12 3.54 3.54c1.17-1.18 1.17-3.08 0-4.25M5.49 13.77c.59.59 1.54.59 2.12 0l2.47-2.47-2.12-2.13-2.47 2.47c-.59.59-.59 1.54 0 2.13"},"0"),(0,r.jsx)("path",{d:"m15.04 7.76-.71.71-.71.71L10.44 6c-.59-.6-1.54-.6-2.12-.01-.59.59-.59 1.54 0 2.12l3.18 3.18-.71.71-6.36 6.36c-.78.78-.78 2.05 0 2.83.78.78 2.05.78 2.83 0L16.45 12c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"},"1")],"Plumbing"),en}const rn=V(tn());var nn,on={};function an(){if(nn)return on;nn=1;var e=E();Object.defineProperty(on,"__esModule",{value:!0}),on.default=void 0;var t=e(q()),r=M();return on.default=(0,t.default)([(0,r.jsx)("path",{d:"m21.67 18.17-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41"},"0"),(0,r.jsx)("path",{d:"m17.34 10.19 1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15z"},"1")],"Handyman"),on}const sn=V(an());var cn,ln={};function dn(){if(cn)return ln;cn=1;var e=E();Object.defineProperty(ln,"__esModule",{value:!0}),ln.default=void 0;var t=e(q()),r=M();return ln.default=(0,t.default)((0,r.jsx)("path",{d:"M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4z"}),"FormatPaint"),ln}const fn=V(dn());var un,mn={};function pn(){if(un)return mn;un=1;var e=E();Object.defineProperty(mn,"__esModule",{value:!0}),mn.default=void 0;var t=e(q()),r=M();return mn.default=(0,t.default)((0,r.jsx)("path",{d:"m22.7 19-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4"}),"Build"),mn}const hn=V(pn());var xn,gn={};function bn(){if(xn)return gn;xn=1;var e=E();Object.defineProperty(gn,"__esModule",{value:!0}),gn.default=void 0;var t=e(q()),r=M();return gn.default=(0,t.default)((0,r.jsx)("path",{d:"M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2z"}),"House"),gn}const yn=V(bn());var vn,jn={};function wn(){if(vn)return jn;vn=1;var e=E();Object.defineProperty(jn,"__esModule",{value:!0}),jn.default=void 0;var t=e(q()),r=M();return jn.default=(0,t.default)((0,r.jsx)("path",{d:"M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11z"}),"Security"),jn}const kn=V(wn());var Sn,Cn={};function Tn(){if(Sn)return Cn;Sn=1;var e=E();Object.defineProperty(Cn,"__esModule",{value:!0}),Cn.default=void 0;var t=e(q()),r=M();return Cn.default=(0,t.default)((0,r.jsx)("path",{d:"M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m13.5-9 1.96 2.5H17V9.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5"}),"LocalShipping"),Cn}const On=V(Tn());var zn,An={};function En(){if(zn)return An;zn=1;var e=E();Object.defineProperty(An,"__esModule",{value:!0}),An.default=void 0;var t=e(q()),r=M();return An.default=(0,t.default)((0,r.jsx)("path",{d:"M13 5.7V4h3l-1-1.49L16 1h-5v4.7L2 12v10h7v-5l3.03-2L15 17v5h7V12z"}),"Festival"),An}const Mn=V(En());var Wn,Pn={};function In(){if(Wn)return Pn;Wn=1;var e=E();Object.defineProperty(Pn,"__esModule",{value:!0}),Pn.default=void 0;var t=e(q()),r=M();return Pn.default=(0,t.default)((0,r.jsx)("path",{d:"M16 11h-1V3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v8H8c-2.76 0-5 2.24-5 5v7h18v-7c0-2.76-2.24-5-5-5m3 10h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H9v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H5v-5c0-1.65 1.35-3 3-3h8c1.65 0 3 1.35 3 3z"}),"CleaningServices"),Pn}const Rn=V(In());var Ln,Fn={};function Bn(){if(Ln)return Fn;Ln=1;var e=E();Object.defineProperty(Fn,"__esModule",{value:!0}),Fn.default=void 0;var t=e(q()),r=M();return Fn.default=(0,t.default)((0,r.jsx)("path",{d:"M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3zM14 5h-3l-1-1H6L5 5H2v2h12z"}),"DeleteSweep"),Fn}const _n=V(Bn());var Hn,Yn={};function Dn(){if(Hn)return Yn;Hn=1;var e=E();Object.defineProperty(Yn,"__esModule",{value:!0}),Yn.default=void 0;var t=e(q()),r=M();return Yn.default=(0,t.default)([(0,r.jsx)("path",{d:"M1 11v10h5v-6h4v6h5V11L8 6z"},"0"),(0,r.jsx)("path",{d:"M10 3v1.97l7 5V11h2v2h-2v2h2v2h-2v4h6V3zm9 6h-2V7h2z"},"1")],"HomeWork"),Yn}const Vn=V(Dn());var Nn,Un={};function $n(){if(Nn)return Un;Nn=1;var e=E();Object.defineProperty(Un,"__esModule",{value:!0}),Un.default=void 0;var t=e(q()),r=M();return Un.default=(0,t.default)([(0,r.jsx)("path",{d:"M19.5 12c.93 0 1.78.28 2.5.76V8c0-1.1-.9-2-2-2h-6.29l-1.06-1.06 1.41-1.41-.71-.71-3.53 3.53.71.71 1.41-1.41L13 6.71V9c0 1.1-.9 2-2 2h-.54c.95 1.06 1.54 2.46 1.54 4 0 .34-.04.67-.09 1h3.14c.25-2.25 2.14-4 4.45-4"},"0"),(0,r.jsx)("path",{d:"M19.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5m0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M4 9h5c0-1.1-.9-2-2-2H4c-.55 0-1 .45-1 1s.45 1 1 1m5.83 4.82-.18-.47.93-.35c-.46-1.06-1.28-1.91-2.31-2.43l-.4.89-.46-.21.4-.9C7.26 10.13 6.64 10 6 10c-.53 0-1.04.11-1.52.26l.34.91-.47.18-.35-.93c-1.06.46-1.91 1.28-2.43 2.31l.89.4-.21.46-.9-.4C1.13 13.74 1 14.36 1 15c0 .53.11 1.04.26 1.52l.91-.34.18.47-.93.35c.46 1.06 1.28 1.91 2.31 2.43l.4-.89.46.21-.4.9c.55.22 1.17.35 1.81.35.53 0 1.04-.11 1.52-.26l-.34-.91.47-.18.35.93c1.06-.46 1.91-1.28 2.43-2.31l-.89-.4.21-.46.9.4c.22-.55.35-1.17.35-1.81 0-.53-.11-1.04-.26-1.52zm-2.68 3.95c-1.53.63-3.29-.09-3.92-1.62-.63-1.53.09-3.29 1.62-3.92 1.53-.63 3.29.09 3.92 1.62.64 1.53-.09 3.29-1.62 3.92"},"1")],"Agriculture"),Un}const Xn=V($n());var qn,Gn={};function Kn(){if(qn)return Gn;qn=1;var e=E();Object.defineProperty(Gn,"__esModule",{value:!0}),Gn.default=void 0;var t=e(q()),r=M();return Gn.default=(0,t.default)([(0,r.jsx)("path",{d:"M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1"},"0"),(0,r.jsx)("path",{d:"M5 6h5v2H5zm14 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3m0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"},"1")],"DeliveryDining"),Gn}const Jn=V(Kn());var Zn,Qn={};function eo(){if(Zn)return Qn;Zn=1;var e=E();Object.defineProperty(Qn,"__esModule",{value:!0}),Qn.default=void 0;var t=e(q()),r=M();return Qn.default=(0,t.default)((0,r.jsx)("path",{d:"m14.17 13.71 1.4-2.42c.09-.15.05-.34-.08-.45l-1.48-1.16c.03-.22.05-.45.05-.68s-.02-.46-.05-.69l1.48-1.16c.13-.11.17-.3.08-.45l-1.4-2.42c-.09-.15-.27-.21-.43-.15l-1.74.7c-.36-.28-.75-.51-1.18-.69l-.26-1.85c-.03-.16-.18-.29-.35-.29h-2.8c-.17 0-.32.13-.35.3L6.8 4.15c-.42.18-.82.41-1.18.69l-1.74-.7c-.16-.06-.34 0-.43.15l-1.4 2.42c-.09.15-.05.34.08.45l1.48 1.16c-.03.22-.05.45-.05.68s.02.46.05.69l-1.48 1.16c-.13.11-.17.3-.08.45l1.4 2.42c.09.15.27.21.43.15l1.74-.7c.36.28.75.51 1.18.69l.26 1.85c.03.16.18.29.35.29h2.8c.17 0 .32-.13.35-.3l.26-1.85c.42-.18.82-.41 1.18-.69l1.74.7c.16.06.34 0 .43-.15M8.81 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m13.11 7.67-.96-.74c.02-.14.04-.29.04-.44 0-.15-.01-.3-.04-.44l.95-.74c.08-.07.11-.19.05-.29l-.9-1.55c-.05-.1-.17-.13-.28-.1l-1.11.45c-.23-.18-.48-.33-.76-.44l-.17-1.18c-.01-.12-.11-.2-.21-.2h-1.79c-.11 0-.21.08-.22.19l-.17 1.18c-.27.12-.53.26-.76.44l-1.11-.45c-.1-.04-.22 0-.28.1l-.9 1.55c-.05.1-.04.22.05.29l.95.74c-.02.14-.03.29-.03.44 0 .15.01.3.03.44l-.95.74c-.08.07-.11.19-.05.29l.9 1.55c.05.1.17.13.28.1l1.11-.45c.23.18.48.33.76.44l.17 1.18c.02.11.11.19.22.19h1.79c.11 0 .21-.08.22-.19l.17-1.18c.27-.12.53-.26.75-.44l1.12.45c.1.04.22 0 .28-.1l.9-1.55c.06-.09.03-.21-.05-.28m-4.29.16c-.74 0-1.35-.6-1.35-1.35s.6-1.35 1.35-1.35 1.35.6 1.35 1.35-.61 1.35-1.35 1.35"}),"MiscellaneousServices"),Qn}const to=V(eo()),ro=[{en:"Building Construction",icon:e.jsx(qr,{sx:{fontSize:36,color:"#fbc02d"}})},{en:"Electrical and Wiring",icon:e.jsx(Zr,{sx:{fontSize:36,color:"#f57c00"}})},{en:"Plumbing and Sanitation",icon:e.jsx(rn,{sx:{fontSize:36,color:"#00796b"}})},{en:"Carpentry and Woodwork",icon:e.jsx(sn,{sx:{fontSize:36,color:"#6d4c41"}})},{en:"Painting and Finishing",icon:e.jsx(fn,{sx:{fontSize:36,color:"#ef6c00"}})},{en:"Fabrication and Welding",icon:e.jsx(hn,{sx:{fontSize:36,color:"#00695c"}})},{en:"Domestic and House Help",icon:e.jsx(yn,{sx:{fontSize:36,color:"#fbc02d"}})},{en:"Cleaning and Maintenance",icon:e.jsx(Rn,{sx:{fontSize:36,color:"#388e3c"}})},{en:"Security Services",icon:e.jsx(kn,{sx:{fontSize:36,color:"#d32f2f"}})},{en:"Transportation and Loading",icon:e.jsx(On,{sx:{fontSize:36,color:"#f9a825"}})},{en:"Tent House Works",icon:e.jsx(Mn,{sx:{fontSize:36,color:"#7b1fa2"}})},{en:"Cleaning Works",icon:e.jsx(_n,{sx:{fontSize:36,color:"#43a047"}})},{en:"Household Services",icon:e.jsx(Vn,{sx:{fontSize:36,color:"#fbc02d"}})},{en:"Farming and Gardening",icon:e.jsx(Xn,{sx:{fontSize:36,color:"#2e7d32"}})},{en:"Driving and Delivery",icon:e.jsx(Jn,{sx:{fontSize:36,color:"#f9a825"}})},{en:"Specialized Services",icon:e.jsx(to,{sx:{fontSize:36,color:"#0288d1"}})}],no=e=>{switch(e){case"Building Construction":return"#E3F2FD";case"Electrical and Wiring":case"Painting and Finishing":case"Transportation and Loading":case"Driving and Delivery":return"#FFF3E0";case"Plumbing and Sanitation":case"Cleaning and Maintenance":case"Cleaning Works":case"Farming and Gardening":return"#E8F5E9";case"Carpentry and Woodwork":case"Tent House Works":return"#F3E5F5";case"Fabrication and Welding":case"Specialized Services":return"#E0F7FA";case"Domestic and House Help":case"Household Services":return"#FFFDE7";case"Security Services":return"#FFEBEE";default:return"#FFFFFF"}},oo=({onServiceClick:t})=>{const{i18n:r}=U(),a=H.useRef();H.useEffect(()=>{const e=setInterval(()=>{a.current&&a.current.scrollBy({left:200,behavior:"smooth"})},3e3);return()=>clearInterval(e)},[]);const i=e=>{if(a.current){const t=a.current.offsetWidth/2;a.current.scrollBy({left:"left"===e?-t:t,behavior:"smooth"})}};return e.jsxs(o,{sx:{position:"relative",py:1,backgroundColor:"#f9f9f9"},children:[e.jsx(l,{sx:{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",zIndex:10},onClick:()=>i("left"),children:e.jsx(ne,{})}),e.jsx(l,{sx:{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",zIndex:10},onClick:()=>i("right"),children:e.jsx(oe,{})}),e.jsx(o,{ref:a,sx:{display:"flex",gap:2,overflowX:"auto",scrollSnapType:"x mandatory","&::-webkit-scrollbar":{display:"none"}},children:[...ro,...ro].map((r,o)=>{const a=r.en;return e.jsxs(b,{onClick:()=>t&&t(a),sx:{flex:"0 0 auto",scrollSnapAlign:"center",width:180,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",p:2,mt:2,mb:2,borderRadius:3,boxShadow:"0 8px 20px rgba(0,0,0,0.1)",backgroundColor:no(a),cursor:"pointer",transition:"transform 0.3s, box-shadow 0.3s","&:hover":{transform:"translateY(-5px)",boxShadow:"0 12px 25px rgba(0,0,0,0.2)"}},children:[e.jsx(A,{sx:{bgcolor:"white",width:72,height:72,mb:2,fontSize:32,display:"flex",alignItems:"center",justifyContent:"center"},children:r.icon}),e.jsx(W,{sx:{p:0},children:e.jsx(n,{variant:"body1",fontWeight:700,textAlign:"center",children:a})})]},o)})})]})};var ao,io={};function so(){if(ao)return io;ao=1;var e=E();Object.defineProperty(io,"__esModule",{value:!0}),io.default=void 0;var t=e(q()),r=M();return io.default=(0,t.default)((0,r.jsx)("path",{d:"M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"}),"KeyboardArrowUp"),io}const co=V(so()),lo=()=>{const[t,r]=H.useState(!1);H.useEffect(()=>{const e=()=>{r(window.scrollY>100)};return window.addEventListener("scroll",e),e(),()=>window.removeEventListener("scroll",e)},[]);return e.jsx(P,{in:t,children:e.jsx(o,{onClick:()=>{window.scrollTo({top:0,behavior:"smooth"})},sx:{position:"fixed",bottom:16,right:16,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"primary.main",color:"white",borderRadius:"50%",width:48,height:48,cursor:"pointer","&:hover":{bgcolor:"primary.dark"}},children:e.jsx(co,{})})})},fo=({onFooterMenuClick:t})=>{const{t:r}=U(),[a,i]=H.useState(!1);return H.useEffect(()=>{const e=()=>i(window.scrollY>300);return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]),e.jsxs(o,{component:"footer",sx:{bgcolor:"rgb(10 124 202)",pt:8,pb:4,color:"#fff",position:"relative",overflow:"hidden"},children:[e.jsxs(x,{maxWidth:!1,sx:{px:{xs:2,sm:3,md:4},position:"relative",zIndex:1},children:[e.jsxs(g,{container:!0,spacing:4,children:[e.jsxs(g,{item:!0,xs:12,sm:6,md:4,children:[e.jsx(o,{display:"flex",alignItems:"center",mb:2,children:e.jsxs(n,{variant:"h5",sx:{display:"flex",alignItems:"center",flexGrow:1,color:"white"},children:[e.jsx("img",{src:"/app/logo.jpg",alt:"BookMyWorker",style:{height:54,width:48}}),e.jsxs(o,{sx:{lineHeight:1},children:[e.jsx(o,{sx:{fontWeight:"bolder"},children:"BookMyWorker"}),e.jsx(o,{sx:{fontSize:9,fontWeight:"bolder",color:"rgba(255,255,255,0.8)"},children:"Trusted workforce solutions in india"})]})]})}),e.jsx(n,{variant:"body2",sx:{mb:1,fontWeight:"bolder"},children:"KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India"}),e.jsxs(n,{variant:"body2",sx:{mb:1,fontWeight:"bolder"},children:[e.jsx("span",{children:"GST:"})," 23NBJPS3070R1ZQ"]}),e.jsxs(n,{variant:"body2",sx:{mb:1},children:[e.jsx("span",{children:"Phone:"})," ",e.jsx(I,{href:"tel:+917389791873",sx:{color:"#fff",textDecoration:"underline"},children:"+91 7389791873"})]}),e.jsxs(n,{variant:"body2",sx:{mb:1},children:[e.jsx("span",{children:"Business Email:"})," ",e.jsx(I,{href:"mailto:business@bookmyworkers.com",sx:{color:"#fff",textDecoration:"underline"},children:"business@bookmyworkers.com"})]}),e.jsxs(n,{variant:"body2",sx:{mb:1},children:[e.jsx("span",{children:"Support Email:"})," ",e.jsx(I,{href:"mailto:support@bookmyworkers.com",sx:{color:"#fff",textDecoration:"underline"},children:"support@bookmyworkers.com"})]}),e.jsx(o,{mt:2,display:"flex",gap:1,children:[{icon:e.jsx(ae,{}),link:"https://twitter.com"},{icon:e.jsx(ie,{}),link:"https://www.facebook.com/BookMyWorker"},{icon:e.jsx(se,{}),link:"https://www.instagram.com/bookmyworker/"},{icon:e.jsx(ce,{}),link:"https://www.linkedin.com/company/bookmyworker"}].map((t,r)=>e.jsx(l,{component:"a",href:t.link,target:"_blank",rel:"noopener noreferrer",sx:{color:"#fff",bgcolor:"rgba(255,255,255,0.15)","&:hover":{bgcolor:"rgba(255,255,255,0.3)",transform:"scale(1.1)"},transition:"all 0.3s ease"},children:t.icon},r))})]}),e.jsxs(g,{item:!0,xs:6,sm:6,md:2,children:[e.jsx(n,{variant:"subtitle1",component:"div",sx:{color:"#fff",fontSize:"1.25rem",fontWeight:500},gutterBottom:!0,children:r("Useful Links")||"Useful Links"}),[{name:"Home",link:"#hero",page:"home"},{name:"About Us",link:"#about",page:"home"},{name:"Workforce Category",link:"#features",page:"home"},{name:"Services",link:"#services",page:"home"},{name:"Privacy Policy",link:"#privacy",page:"privacy"},{name:"Terms & Conditions",link:"#terms",page:"terms"}].map((r,n)=>e.jsx(I,{href:r.link,variant:"body2",display:"block",sx:{my:.5,color:"#fff","&:hover":{color:"#ffeb3b",textDecoration:"underline"},transition:"all 0.3s ease"},onClick:()=>(e=>{e.page&&t(e.page)})(r),children:r.name},n)),e.jsx(n,{variant:"subtitle1",component:"div",sx:{color:"#fff",fontSize:"1.25rem",fontWeight:500},gutterBottom:!0,mt:2,children:r("Certificate")||"Certificate"}),e.jsx(o,{mt:1,children:e.jsx("img",{src:"./assets/img/gst.png",width:80,height:80,alt:"GST Certificate",style:{borderRadius:8}})})]}),e.jsxs(g,{item:!0,xs:12,sm:12,md:6,children:[e.jsx(n,{variant:"subtitle1",component:"div",sx:{color:"#fff",fontSize:"1.25rem",fontWeight:500},gutterBottom:!0,children:r("Our Location")||"Our Location"}),e.jsx(o,{component:"iframe",src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.589745780852!2d81.28419597599159!3d24.532552078137116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847e6a8f88b6b1%3A0x6f55a3e398205b55!2sGalla%20Mandi%2C%20Rewa%2C%20Madhya%20Pradesh%20486001!5e0!3m2!1sen!2sin!4v1712999305882!5m2!1sen!2sin",width:"100%",height:"250px",style:{border:0,borderRadius:8},loading:"lazy",allowFullScreen:"",referrerPolicy:"no-referrer-when-downgrade",title:"Office Location"})]})]}),e.jsx(o,{mt:5,textAlign:"center",pt:2,borderTop:"1px solid rgba(255,255,255,0.3)",children:e.jsxs(n,{variant:"body2",sx:{color:"#fff"},children:["© ",(new Date).getFullYear()," ",e.jsx("span",{children:"BookMyWorker"}),". All Rights Reserved"]})})]}),a&&e.jsx(lo,{})]})},uo=()=>e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/privacy"})]}),e.jsx(o,{id:"privacy",component:"section",sx:{py:8,backgroundColor:"#fafafa"},children:e.jsxs(x,{maxWidth:!1,disableGutters:!0,"data-aos":"fade-up","data-aos-delay":"100",sx:{px:{xs:1,sm:2,md:3}},children:[" ",e.jsx(R,{elevation:3,sx:{p:4},children:e.jsxs(g,{container:!0,spacing:4,children:[e.jsx(g,{item:!0,xs:12,children:e.jsx(n,{variant:"h4",component:"h2",gutterBottom:!0,children:"Privacy & Policy"})}),e.jsx(g,{item:!0,xs:12,children:e.jsxs(o,{children:[e.jsxs(n,{variant:"body1",paragraph:!0,children:["At ",e.jsx("strong",{children:"BookMyWorker"}),", we care about your privacy. When you use our website or app, we may collect personal details like your name, contact information, Aadhaar, PAN, bank details (from Agents/Workers & Employers), job details, and usage data. This information helps us connect employers with the right workers through our registered Worker Service Agents, manage accounts, and improve our services."," "]}),e.jsx(f,{sx:{my:4}}),e.jsxs(n,{variant:"body1",paragraph:!0,children:["At ",e.jsx("strong",{children:"BookMyWorker"}),", We only share your information when necessary—with verified Worker Service Agents for job coordination, with employers for job assignments, or with legal authorities if required by law. Your information is stored securely, and we take all possible steps to keep it safe. We also use cookies to improve your browsing experience. You can control cookie settings through your browser."," "]}),e.jsx(f,{sx:{my:4}}),e.jsxs(n,{variant:"body1",paragraph:!0,children:["We are not responsible for other websites linked on our platform. Please read their privacy policies separately. You have full rights to access, update, or request the deletion of your data by contacting us."," "]}),e.jsxs(n,{sx:{my:4},children:["We may update this privacy policy from time to time. Continued use of our platform means you agree to any changes made. If you have any questions, feel free to reach us at ",e.jsx("strong",{children:"support@bookmyworkers.com"}),"."]})]})})]})})]})})]}),mo=({title:t,children:r})=>e.jsxs(o,{mb:4,children:[e.jsx(n,{variant:"h6",fontWeight:"bold",gutterBottom:!0,children:t}),r]}),po=({children:t})=>e.jsx(n,{variant:"body1",component:"li",sx:{mb:1},children:t}),ho=()=>e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/terms"})]}),e.jsx(o,{id:"terms",component:"section",sx:{py:8,backgroundColor:"#fafafa"},children:e.jsxs(x,{maxWidth:!1,disableGutters:!0,"data-aos":"fade-up","data-aos-delay":"100",sx:{px:{xs:1,sm:2,md:3}},children:[" ",e.jsxs(R,{elevation:3,sx:{p:4},children:[e.jsx(n,{variant:"h4",fontWeight:"bold",gutterBottom:!0,children:"Terms and Conditions"}),e.jsxs(n,{variant:"subtitle1",gutterBottom:!0,children:["Effective Date: 01-05-2025",e.jsx("br",{}),"Platform: BookMyWorker"]}),e.jsx(n,{variant:"body1",sx:{mb:3},children:"These terms apply to all employers who register on BookMyWorker to hire skilled or unskilled workers through our verified Worker Service Agents. By registering and using our services, you agree to the following:"}),e.jsx(mo,{title:"1. Registration and Account Use",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers must provide accurate and complete details during registration."}),e.jsx(po,{children:"Only authorized persons should use the employer account."}),e.jsx(po,{children:"We reserve the right to approve, suspend, or terminate any account if found violating terms."})]})}),e.jsx(mo,{title:"2. Job Posting and Worker Hiring",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers can post job requirements and request workers as per their needs."}),e.jsx(po,{children:"Job details (work type, timing, payment, location) must be clear, honest, and legal."}),e.jsx(po,{children:"Worker assignments will be made through registered Worker Service Agents."})]})}),e.jsx(mo,{title:"3. Payment and Charges",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers must pay:"}),e.jsxs("ul",{children:[e.jsx(po,{children:"Workers’ wages on time, as agreed before work begins."}),e.jsx(po,{children:"Any platform or service agent fees as communicated before hiring."})]}),e.jsx(po,{children:"Delayed or non-payment may lead to account suspension or legal action."})]})}),e.jsx(mo,{title:"4. Work Environment and Conduct",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers must provide:"}),e.jsxs("ul",{children:[e.jsx(po,{children:"Safe, legal, and respectful working conditions."}),e.jsx(po,{children:"Basic facilities required for the type of work (if applicable)."})]}),e.jsx(po,{children:"Harassment, abuse, or discrimination is strictly prohibited."})]})}),e.jsx(mo,{title:"5. Cooperation with Worker Service Agents",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers must coordinate with assigned service agents for worker selection, onboarding, and issue resolution."}),e.jsx(po,{children:"Any concerns about workers should be first raised with the assigned agent."})]})}),e.jsx(mo,{title:"6. Cancellations and Job Changes",children:e.jsxs("ul",{children:[e.jsx(po,{children:"If a job needs to be cancelled or changed, employers must:"}),e.jsxs("ul",{children:[e.jsx(po,{children:"Notify the service agent at the earliest."}),e.jsx(po,{children:"Provide a valid reason for cancellation."})]}),e.jsx(po,{children:"Repeated or unfair cancellations may lead to platform restrictions."}),e.jsx(po,{children:"All services are non refundable."})]})}),e.jsx(mo,{title:"7. Responsibility and Liability",children:e.jsxs("ul",{children:[e.jsx(po,{children:"BookMyWorker is only a connecting platform and does not act as an employer."}),e.jsx(po,{children:"We are not liable for:"}),e.jsxs("ul",{children:[e.jsx(po,{children:"Work performance, loss, or injury during the job."}),e.jsx(po,{children:"Any disputes between employers and workers, though we will assist in resolution."})]})]})}),e.jsx(mo,{title:"8. Data Privacy",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employer data will be kept confidential and used only for service-related purposes."}),e.jsx(po,{children:"Employers are also responsible for maintaining the privacy of workers’ information."})]})}),e.jsx(mo,{title:"9. Termination or Suspension",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employer accounts may be suspended or removed for:"}),e.jsxs("ul",{children:[e.jsx(po,{children:"Violating platform policies."}),e.jsx(po,{children:"Non-payment or misuse of services."}),e.jsx(po,{children:"Unsafe or unethical treatment of workers."})]})]})}),e.jsx(mo,{title:"10. Legal Compliance",children:e.jsxs("ul",{children:[e.jsx(po,{children:"Employers agree to follow all applicable labor laws and local employment regulations."}),e.jsx(po,{children:"Any disputes or legal matters will be subject to the jurisdiction of Rewa, Madhya Pradesh."})]})}),e.jsx(mo,{title:"11. Updates to Terms",children:e.jsxs("ul",{children:[e.jsx(po,{children:"BookMyWorker may change these terms at any time."}),e.jsx(po,{children:"Employers will be informed of major updates, and continued use means acceptance of new terms."}),e.jsx(po,{children:"BookMyWorker Is managed by BookMyWorker."})]})})]})]})})]});var xo,go={};function bo(){if(xo)return go;xo=1;var e=E();Object.defineProperty(go,"__esModule",{value:!0}),go.default=void 0;var t=e(q()),r=M();return go.default=(0,t.default)((0,r.jsx)("path",{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z"}),"Email"),go}const yo=V(bo());var vo,jo={};function wo(){if(vo)return jo;vo=1;var e=E();Object.defineProperty(jo,"__esModule",{value:!0}),jo.default=void 0;var t=e(q()),r=M();return jo.default=(0,t.default)((0,r.jsx)("path",{d:"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02z"}),"Phone"),jo}const ko=V(wo()),So=()=>{const[t,r]=H.useState({name:"",email:"",subject:"",message:"",phone:""}),[i,s]=H.useState(!1),[c,l]=H.useState(!1),[d,f]=H.useState(null),u=e=>{r({...t,[e.target.name]:e.target.value})};return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/contact"})]}),e.jsx(o,{id:"contact",sx:{py:10,background:"linear-gradient(135deg, #f9f9f9, #e0f7fa)"},children:e.jsxs(x,{maxWidth:!1,disableGutters:!0,sx:{px:{xs:2,sm:3,md:6}},"data-aos":"fade-up","data-aos-delay":"100",children:[e.jsxs(Ir,{cascade:!0,children:[e.jsx(n,{variant:"h4",align:"center",gutterBottom:!0,sx:{fontWeight:700,mb:4},children:"Get in Touch"}),e.jsx(n,{variant:"body1",align:"center",mb:6,color:"text.secondary",children:"Let’s connect! Share your query or business requirement below, and our BookMyWorker team will respond with the right solution.            "})]}),e.jsxs(g,{container:!0,spacing:6,children:[e.jsx(g,{item:!0,xs:12,md:5,children:e.jsx(Ir,{direction:"left",triggerOnce:!0,children:e.jsxs(R,{sx:{p:4,borderRadius:3,boxShadow:"0 10px 30px rgba(0,0,0,0.08)",background:"linear-gradient(145deg, #ffffff, #e0f7f7)"},children:[e.jsxs(o,{mb:4,children:[e.jsxs(n,{variant:"h6",sx:{display:"flex",alignItems:"center",mb:1},children:[e.jsx(G,{sx:{mr:1,color:"primary.main"}}),"Our Location"]}),e.jsx(n,{variant:"body2",color:"text.secondary",children:"KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India"})]}),e.jsxs(o,{mb:4,children:[e.jsxs(n,{variant:"h6",sx:{display:"flex",alignItems:"center",mb:1},children:[e.jsx(ko,{sx:{mr:1,color:"primary.main"}}),"Phone Number"]}),e.jsx(n,{variant:"body2",children:e.jsx(I,{href:"tel:+917389791873",underline:"hover",children:"+91 7389791873"})})]}),e.jsxs(o,{children:[e.jsxs(n,{variant:"h6",sx:{display:"flex",alignItems:"center",mb:1},children:[e.jsx(yo,{sx:{mr:1,color:"primary.main"}}),"Email Address"]}),e.jsx(n,{variant:"body2",children:"support@bookmyworkers.com"}),e.jsx(n,{variant:"body2",children:"business@bookmyworkers.com"})]})]})})}),e.jsx(g,{item:!0,xs:12,md:7,children:e.jsx(Ir,{direction:"right",triggerOnce:!0,children:e.jsx(R,{sx:{p:4,borderRadius:3,boxShadow:"0 10px 30px rgba(0,0,0,0.08)",background:"linear-gradient(145deg, #ffffff, #e0f7f7)"},children:e.jsx("form",{onSubmit:async e=>{e.preventDefault(),s(!0),f(null),l(!1);try{(await K.post(`${X.API_BASE_URL}/api/email/send-email`,t)).data.success?(l(!0),r({name:"",email:"",subject:"",message:"",phone:""})):f("Failed to send email.")}catch(n){f("Something went wrong.")}s(!1)},children:e.jsxs(g,{container:!0,spacing:3,children:[e.jsx(g,{item:!0,xs:12,md:6,children:e.jsx(L,{fullWidth:!0,label:"Your Name",name:"name",value:t.name,onChange:u,required:!0,sx:{borderRadius:2}})}),e.jsx(g,{item:!0,xs:12,md:6,children:e.jsx(L,{fullWidth:!0,type:"email",label:"Your Email",name:"email",value:t.email,onChange:u,required:!0})}),e.jsx(g,{item:!0,xs:12,children:e.jsx(L,{fullWidth:!0,label:"Phone",name:"phone",value:t.phone,onChange:u,required:!0})}),e.jsx(g,{item:!0,xs:12,children:e.jsx(L,{fullWidth:!0,label:"Subject",name:"subject",value:t.subject,onChange:u,required:!0})}),e.jsx(g,{item:!0,xs:12,children:e.jsx(L,{fullWidth:!0,multiline:!0,rows:1,label:"Message",name:"message",value:t.message,onChange:u,required:!0})}),i&&e.jsx(g,{item:!0,xs:12,children:e.jsx(F,{size:28})}),c&&e.jsx(g,{item:!0,xs:12,children:e.jsx(B,{severity:"success",children:"Your message has been sent. Thank you!"})}),d&&e.jsx(g,{item:!0,xs:12,children:e.jsx(B,{severity:"error",children:d})}),e.jsx(g,{item:!0,xs:12,children:e.jsx(a,{variant:"contained",type:"submit",fullWidth:!0,disabled:i,sx:{py:1.5,fontWeight:700,borderRadius:"25px",background:"linear-gradient(to right, #00c6ff, #0072ff)",color:"#fff",textTransform:"none","&:hover":{background:"linear-gradient(to right, #0072ff, #00c6ff)"}},children:"Send Message"})})]})})})})})]})]})})]})},Co=()=>{const{t:t}=U(),r=[{icon:e.jsx(de,{}),title:t("servicesssss.groupLabor.title"),desc:t("servicesssss.groupLabor.desc"),color:"#1976d2"},{icon:e.jsx(xe,{}),title:t("servicesssss.skilled.title"),desc:t("servicesssss.skilled.desc"),color:"#388e3c"},{icon:e.jsx(ge,{}),title:t("servicesssss.semiSkilled.title"),desc:t("servicesssss.semiSkilled.desc"),color:"#f57c00"},{icon:e.jsx(be,{}),title:t("servicesssss.helpers.title"),desc:t("servicesssss.helpers.desc"),color:"#6a1b9a"}];return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/services"})]}),e.jsx(o,{id:"services",sx:{py:4,background:"linear-gradient(135deg, #fff, #f2f7fb)"},children:e.jsxs(x,{maxWidth:!1,disableGutters:!0,"data-aos":"fade-up","data-aos-delay":"100",sx:{px:{xs:2,sm:3,md:6}},children:[e.jsxs(Ir,{cascade:!0,children:[e.jsx(n,{variant:"h4",align:"center",gutterBottom:!0,sx:{fontWeight:700,mb:2},children:t("servicesssss.heading")}),e.jsx(n,{variant:"body1",align:"center",mb:6,color:"text.secondary",children:t("servicesssss.subheading")})]}),e.jsx(g,{container:!0,spacing:4,children:r.map((t,r)=>e.jsx(g,{item:!0,xs:12,md:6,children:e.jsx(Ir,{delay:150*r,children:e.jsxs(b,{sx:{display:"flex",alignItems:"flex-start",p:3,borderRadius:3,background:"#fff",boxShadow:"0 8px 30px rgba(0,0,0,0.05)",transition:"all 0.3s ease",cursor:"pointer","&:hover":{transform:"translateY(-5px)",boxShadow:"0 15px 40px rgba(0,0,0,0.15)"}},children:[e.jsx(o,{sx:{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg, ${t.color}33, ${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:t.color,mr:3,flexShrink:0,boxShadow:"0 4px 15px rgba(0,0,0,0.08)"},children:t.icon}),e.jsxs(W,{sx:{p:0},children:[e.jsx(n,{variant:"h6",sx:{fontWeight:600,mb:1},children:t.title}),e.jsx(n,{variant:"body2",color:"text.secondary",children:t.desc})]})]})})},r))})]})})]})};
/*! js-cookie v3.0.5 | MIT */
function To(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}var Oo=function e(t,r){function n(e,n,o){if("undefined"!=typeof document){"number"==typeof(o=To({},r,o)).expires&&(o.expires=new Date(Date.now()+864e5*o.expires)),o.expires&&(o.expires=o.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var a="";for(var i in o)o[i]&&(a+="; "+i,!0!==o[i]&&(a+="="+o[i].split(";")[0]));return document.cookie=e+"="+t.write(n,e)+a}}return Object.create({set:n,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],n={},o=0;o<r.length;o++){var a=r[o].split("="),i=a.slice(1).join("=");try{var s=decodeURIComponent(a[0]);if(n[s]=t.read(i,s),e===s)break}catch(c){}}return e?n[e]:n}},remove:function(e,t){n(e,"",To({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,To({},this.attributes,t))},withConverter:function(t){return e(To({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});const zo=()=>{const[t,r]=H.useState(!1);H.useEffect(()=>{if(!Oo.get("cookie_consent")){const e=setTimeout(()=>r(!0),5e3);return()=>clearTimeout(e)}},[]);return t?e.jsx(P,{in:t,children:e.jsxs(o,{sx:{position:"fixed",bottom:20,left:20,right:20,bgcolor:"white",boxShadow:3,borderRadius:3,p:3,display:"flex",flexDirection:{xs:"column",sm:"row"},alignItems:"center",justifyContent:"space-between",zIndex:2e3,gap:2,maxWidth:600,mx:"auto"},children:[e.jsxs(n,{variant:"body2",sx:{color:"#333",lineHeight:1.6},children:[e.jsx("strong",{children:"Our website uses cookies"})," to enhance your browsing experience, analyze site traffic, and provide personalized content and services. By continuing to use our site, you consent to our use of cookies. You can choose to accept or decline below."]}),e.jsxs(o,{sx:{display:"flex",gap:1,mt:{xs:2,sm:0}},children:[e.jsx(a,{variant:"outlined",color:"inherit",onClick:()=>{Oo.set("cookie_consent","declined",{expires:365}),r(!1)},sx:{borderColor:"#1976d2",color:"#1976d2",fontWeight:"bold","&:hover":{backgroundColor:"#e3f2fd"}},children:"Decline"}),e.jsx(a,{variant:"contained",color:"primary",onClick:()=>{Oo.set("cookie_consent","accepted",{expires:365}),r(!1)},sx:{fontWeight:"bold","&:hover":{backgroundColor:"#1565c0"}},children:"Accept"})]})]})}):null},Ao=()=>{const[t,r]=H.useState(!1),[i,s]=H.useState(!1),{t:c,i18n:d}=U();H.useEffect(()=>{const e=()=>{s(!0),window.removeEventListener("click",e),window.removeEventListener("scroll",e)};return window.addEventListener("click",e),window.addEventListener("scroll",e),()=>{window.removeEventListener("click",e),window.removeEventListener("scroll",e)}},[]),H.useEffect(()=>{const e=setTimeout(()=>{if(r(!0),i){new Audio("/sound.mp3").play().catch(e=>{})}},1e4);return()=>clearTimeout(e)},[i]);return e.jsx(P,{in:t,children:e.jsxs(R,{elevation:10,sx:{position:"fixed",bottom:24,right:24,width:300,p:2.5,borderRadius:3,bgcolor:"#ffffff",zIndex:1300,boxShadow:"0px 4px 20px rgba(0,0,0,0.15)"},children:[e.jsxs(o,{display:"flex",justifyContent:"space-between",alignItems:"center",mb:1,children:[e.jsx(n,{variant:"subtitle1",fontWeight:600,children:"💬 How may I assist you?"}),e.jsx(l,{size:"small",onClick:()=>r(!1),children:e.jsx(J,{fontSize:"small"})})]}),e.jsx(n,{variant:"body2",color:"text.secondary",mb:2,children:"Our support team is just a call away. Feel free to reach out if you need help!"}),e.jsxs(_,{direction:"row",spacing:2,children:[e.jsx(a,{variant:"contained",component:"a",href:"tel:+917089788929",sx:{width:64,height:64,minWidth:64,minHeight:64,borderRadius:"50%",bgcolor:"primary.main",color:"#fff","&:hover":{bgcolor:"primary.dark"},boxShadow:3},children:e.jsx(le,{sx:{fontSize:32}})}),e.jsx(a,{variant:"outlined",href:"https://wa.me/15557193421",sx:{width:64,height:64,minWidth:64,minHeight:64,borderRadius:"50%",color:"#25D366",borderColor:"#25D366","&:hover":{borderColor:"#1ebe5d",backgroundColor:"#eafff1"},boxShadow:3},children:e.jsx(pe,{size:32})})]})]})})},Eo=()=>{const[t,r]=H.useState("home"),n=e=>{r(e),window.scrollTo(0,0)},{t:a,i18n:i}=U(),s=[],c=Math.ceil(Z.length/3),[l,d]=H.useState(!1);for(let e=0;e<Z.length;e+=c)s.push(Z.slice(e,e+c));return e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx("title",{children:"Home: BookMyWorker"}),e.jsx("link",{rel:"canonical",href:"https://www.bookmyworkers.com/home"})]}),e.jsxs(o,{sx:{height:"100vh",display:"flex",flexDirection:"column",overflowX:"hidden"},children:[e.jsx(ve,{onFooterMenuClick:n}),e.jsx(o,{id:"main-scroll-container",component:"main",sx:{flex:1},children:e.jsxs(e.Fragment,{children:[e.jsx(Ft,{}),e.jsx(oo,{}),e.jsx(Bt,{}),e.jsx(Co,{}),e.jsx(Nr,{}),"privacy"===t&&e.jsx(uo,{}),"terms"===t&&e.jsx(ho,{}),e.jsx(So,{}),e.jsx(zo,{}),e.jsx(fo,{onFooterMenuClick:n}),e.jsx(Ao,{})]})})]})]})};export{Eo as default};
