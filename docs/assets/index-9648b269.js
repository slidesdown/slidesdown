var x=Object.defineProperty;var E=(e,s,n)=>s in e?x(e,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[s]=n;var c=(e,s,n)=>(E(e,typeof s!="symbol"?s+"":s,n),n);import{LitElement as i,css as u,html as l}from"https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerpolicy&&(t.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?t.credentials="include":o.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(o){if(o.ep)return;o.ep=!0;const t=n(o);fetch(o.href,t)}})();class d extends i{constructor(){super(),this.name="World"}render(){return l`<p>Hello Man, ${this.name}!</p>`}}c(d,"properties",{name:{}}),c(d,"styles",u`
          :host {
            color: blue;
          }
        `);customElements.define("simple-greeting",d);class m extends i{constructor(){super(),this.class="fa-solid fa-face-smile"}render(){return l`<i class="${this.class}">!</i>`}}c(m,"properties",{class:{}});customElements.define("fa-i",m);class p extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(p,"styles",u`
          :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          }
        `);customElements.define("v-box",p);class g extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(g,"styles",u`
          :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
          }
        `);customElements.define("h-box",g);class h extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(h,"styles",u`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `);customElements.define("grid-box",h);class f extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(f,"styles",u`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `);customElements.define("grid-2",f);class b extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(b,"styles",u`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(3, 1fr);
            grid-column-gap: 10px;
          }
        `);customElements.define("grid-3",b);class R extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(R,"styles",u`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(4, 1fr);
            grid-column-gap: 10px;
          }
        `);customElements.define("grid-4",R);class y extends i{constructor(){super()}render(){return l`<slot></slot>`}}c(y,"styles",u`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `);customElements.define("grid-2x2",y);const w=(e,s)=>{if(!(e.branch&&e.resource)){console.error("ERROR: default branch and/or resource unset");return}const n=decodeURI(s);let r="";if((r=new RegExp(/^(?:https:\/\/)?github\.com\/(?<owner>[a-zA-Z0-9_-]*)\/(?<repo>[a-zA-Z0-9_-]*)(?:\/(?:((?<blob>blob)|(?<tree>tree))\/)?(?:(?<dir_or_branch>[^/]*)\/)?(?<resource>.*))?/).exec(n))!==null){let t=`${e.branch}/${e.resource}`;return r.groups.tree&&r.groups.dir_or_branch?t=`${r.groups.dir_or_branch}/${r.groups.resource}/${e.resource}`:r.groups.blob&&r.groups.dir_or_branch?t=`${r.groups.dir_or_branch}/${r.groups.resource?r.groups.resource:e.resource}`:r.groups.dir_or_branch?t=`${e.branch}/${r.groups.dir_or_branch}/${r.groups.resource?r.groups.resource:e.resource}`:t=`${e.branch}/${r.groups.resource?r.groups.resource:e.resource}`,`https://raw.githubusercontent.com/${r.groups.owner}/${r.groups.repo}/${t}`}return n},$=e=>{if(!(e.branch&&e.resource&&e.markdownElementId)){console.error("ERROR: default branch, resource  and/or markdownElementId are not set");return}const s=new URLSearchParams(new URL(document.URL).search).get("slides");let n=s||`github.com/jceb/slidesdown/blob/${e.branch}/${e.resource}`;if(n=w(e,n),!n){console.error("ERROR: couldn't compute slides URL");return}const r=document.getElementById(e.markdownElementId);if(!r){console.error(`ERROR: couldn't find markdown element with id: ${e.markdownElementId}`);return}r.setAttribute("data-markdown",n),Reveal.initialize({hash:!0,plugins:[RevealMarkdown,RevealHighlight,RevealMath,RevealNotes,RevealSearch,RevealZoom]})};$({branch:"main",resource:"SLIDES.md",markdownElementId:"markdown"});
