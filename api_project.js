define({
  "name": "Robobetty",
  "version": "0.6.0",
  "description": "Mobile REST API",
  "title": "Robobetty",
  "url": "https://www.robobetty.com/api",
  "header": {
    "title": "Introduction",
    "content": "<h2 id=\"introduction\">Introduction</h2>\n<hr>\n<p>About all the api calls require authentication. Meaning every call must include the <code>api token</code> in the <code>Authentication</code> header to successful access resources. See <a href=\"#api-Authentication\">Authentication</a> for more.</p>\n<p>Also, ensure that the proper <code>Content-Type</code> header is always set, so the data sent is received properly.</p>\n<p>For example, when trying to get authentcated:</p>\n<pre><code>curl -X POST -i http://localhost:3000/api/auth \\\n-H &quot;Authorization: Basic bm9ydGh3b29kLmRlbnRhbEBnbWFpbC5jb206cGFzc3dvcmQ=&quot; \\\n-H &quot;Content-Type: application/json&quot; \\\n-d &#39;{&quot;name&quot;:&quot;Frodo&quot;}&#39;\n</code></pre><p>In this case, <code>Content-Type</code> is set to <code>application/json</code>, so the JSON data <code>{&quot;name&quot;:&quot;Frodo&quot;}</code> is received as a JSON.</p>\n"
  },
  "sampleUrl": false,
  "apidoc": "0.2.0",
  "generator": {
    "name": "apidoc",
    "time": "2015-03-15T00:36:00.327Z",
    "url": "http://apidocjs.com",
    "version": "0.12.1"
  }
});