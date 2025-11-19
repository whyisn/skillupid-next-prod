"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/certificates/issue/route";
exports.ids = ["app/api/certificates/issue/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcertificates%2Fissue%2Froute&page=%2Fapi%2Fcertificates%2Fissue%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcertificates%2Fissue%2Froute.js&appDir=D%3A%5Cgithub%5Cskillupid-next-prod%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Cgithub%5Cskillupid-next-prod&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcertificates%2Fissue%2Froute&page=%2Fapi%2Fcertificates%2Fissue%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcertificates%2Fissue%2Froute.js&appDir=D%3A%5Cgithub%5Cskillupid-next-prod%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Cgithub%5Cskillupid-next-prod&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_github_skillupid_next_prod_app_api_certificates_issue_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/certificates/issue/route.js */ \"(rsc)/./app/api/certificates/issue/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/certificates/issue/route\",\n        pathname: \"/api/certificates/issue\",\n        filename: \"route\",\n        bundlePath: \"app/api/certificates/issue/route\"\n    },\n    resolvedPagePath: \"D:\\\\github\\\\skillupid-next-prod\\\\app\\\\api\\\\certificates\\\\issue\\\\route.js\",\n    nextConfigOutput,\n    userland: D_github_skillupid_next_prod_app_api_certificates_issue_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/certificates/issue/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjZXJ0aWZpY2F0ZXMlMkZpc3N1ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY2VydGlmaWNhdGVzJTJGaXNzdWUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjZXJ0aWZpY2F0ZXMlMkZpc3N1ZSUyRnJvdXRlLmpzJmFwcERpcj1EJTNBJTVDZ2l0aHViJTVDc2tpbGx1cGlkLW5leHQtcHJvZCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q2dpdGh1YiU1Q3NraWxsdXBpZC1uZXh0LXByb2QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3dCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tpbGx1cGlkLW5leHQtcHJvZC8/M2VkMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxnaXRodWJcXFxcc2tpbGx1cGlkLW5leHQtcHJvZFxcXFxhcHBcXFxcYXBpXFxcXGNlcnRpZmljYXRlc1xcXFxpc3N1ZVxcXFxyb3V0ZS5qc1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY2VydGlmaWNhdGVzL2lzc3VlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvY2VydGlmaWNhdGVzL2lzc3VlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jZXJ0aWZpY2F0ZXMvaXNzdWUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxnaXRodWJcXFxcc2tpbGx1cGlkLW5leHQtcHJvZFxcXFxhcHBcXFxcYXBpXFxcXGNlcnRpZmljYXRlc1xcXFxpc3N1ZVxcXFxyb3V0ZS5qc1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvY2VydGlmaWNhdGVzL2lzc3VlL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcertificates%2Fissue%2Froute&page=%2Fapi%2Fcertificates%2Fissue%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcertificates%2Fissue%2Froute.js&appDir=D%3A%5Cgithub%5Cskillupid-next-prod%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Cgithub%5Cskillupid-next-prod&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/certificates/issue/route.js":
/*!*********************************************!*\
  !*** ./app/api/certificates/issue/route.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/supabase-server */ \"(rsc)/./lib/supabase-server.js\");\n/* harmony import */ var _lib_certificates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/certificates */ \"(rsc)/./lib/certificates.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n/**\r\n * Issue certificate for a user/course (requires SERVER auth; protect with middleware in production)\r\n * Body: { user_id, course_id, user_name, course_title }\r\n */ // export async function POST(req){\n//   const { user_id, course_id, user_name, course_title } = await req.json();\n//   if(!user_id || !course_id) return NextResponse.json({ error: 'user_id & course_id required' }, { status: 400 });\n//   const code = crypto.randomBytes(6).toString('hex').toUpperCase();\n//   const pdfUrl = await generateCertificatePDF({ userName: user_name || 'Student', courseTitle: course_title || 'Course', code });\n//   const admin = supabaseAdmin();\n//   const { data, error } = await admin.from('certificates').insert({ user_id, course_id, code, pdf_url: pdfUrl }).select().single();\n//   if(error) return NextResponse.json({ error: error.message }, { status: 500 });\n//   return NextResponse.json({ certificate: data });\n// }\nasync function POST(req) {\n    const { user_id, course_id, user_name, course_title } = await req.json();\n    if (!user_id || !course_id) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"user_id & course_id required\"\n    }, {\n        status: 400\n    });\n    const code = crypto__WEBPACK_IMPORTED_MODULE_3___default().randomBytes(6).toString(\"hex\").toUpperCase();\n    const pdfUrl = await (0,_lib_certificates__WEBPACK_IMPORTED_MODULE_2__.generateCertificatePDF)({\n        userName: user_name || \"Student\",\n        courseTitle: course_title || \"Course\",\n        code\n    });\n    const admin = (0,_lib_supabase_server__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin)();\n    const { data, error } = await admin.from(\"certificates\").insert({\n        user_id,\n        course_id,\n        code,\n        pdf_url: pdfUrl\n    }).select().single();\n    if (error) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: error.message\n    }, {\n        status: 500\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        certificate: data\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NlcnRpZmljYXRlcy9pc3N1ZS9yb3V0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMkM7QUFDcUI7QUFDTTtBQUMxQztBQUU1Qjs7O0NBR0MsR0FDRCxtQ0FBbUM7QUFDbkMsOEVBQThFO0FBQzlFLHFIQUFxSDtBQUNySCxzRUFBc0U7QUFDdEUsb0lBQW9JO0FBRXBJLG1DQUFtQztBQUNuQyxzSUFBc0k7QUFDdEksbUZBQW1GO0FBQ25GLHFEQUFxRDtBQUNyRCxJQUFJO0FBRUcsZUFBZUksS0FBS0MsR0FBRztJQUM1QixNQUFNLEVBQUVDLE9BQU8sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLFlBQVksRUFBRSxHQUFHLE1BQU1KLElBQUlLLElBQUk7SUFDdEUsSUFBRyxDQUFDSixXQUFXLENBQUNDLFdBQ2QsT0FBT1AscURBQVlBLENBQUNVLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQStCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBRXBGLE1BQU1DLE9BQU9WLHlEQUFrQixDQUFDLEdBQUdZLFFBQVEsQ0FBQyxPQUFPQyxXQUFXO0lBRTlELE1BQU1DLFNBQVMsTUFBTWYseUVBQXNCQSxDQUFDO1FBQzFDZ0IsVUFBVVYsYUFBYTtRQUN2QlcsYUFBYVYsZ0JBQWdCO1FBQzdCSTtJQUNGO0lBRUEsTUFBTU8sUUFBUW5CLG1FQUFhQTtJQUMzQixNQUFNLEVBQUVvQixJQUFJLEVBQUVWLEtBQUssRUFBRSxHQUFHLE1BQU1TLE1BQzNCRSxJQUFJLENBQUMsZ0JBQ0xDLE1BQU0sQ0FBQztRQUFFakI7UUFBU0M7UUFBV007UUFBTVcsU0FBU1A7SUFBTyxHQUNuRFEsTUFBTSxHQUNOQyxNQUFNO0lBRVQsSUFBR2YsT0FBTyxPQUFPWCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1FBQUVDLE9BQU9BLE1BQU1nQixPQUFPO0lBQUMsR0FBRztRQUFFZixRQUFRO0lBQUk7SUFDM0UsT0FBT1oscURBQVlBLENBQUNVLElBQUksQ0FBQztRQUFFa0IsYUFBYVA7SUFBSztBQUMvQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NraWxsdXBpZC1uZXh0LXByb2QvLi9hcHAvYXBpL2NlcnRpZmljYXRlcy9pc3N1ZS9yb3V0ZS5qcz83NDhhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IHsgc3VwYWJhc2VBZG1pbiB9IGZyb20gJy4uLy4uLy4uLy4uL2xpYi9zdXBhYmFzZS1zZXJ2ZXInO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZUNlcnRpZmljYXRlUERGIH0gZnJvbSAnLi4vLi4vLi4vLi4vbGliL2NlcnRpZmljYXRlcyc7XHJcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcclxuXHJcbi8qKlxyXG4gKiBJc3N1ZSBjZXJ0aWZpY2F0ZSBmb3IgYSB1c2VyL2NvdXJzZSAocmVxdWlyZXMgU0VSVkVSIGF1dGg7IHByb3RlY3Qgd2l0aCBtaWRkbGV3YXJlIGluIHByb2R1Y3Rpb24pXHJcbiAqIEJvZHk6IHsgdXNlcl9pZCwgY291cnNlX2lkLCB1c2VyX25hbWUsIGNvdXJzZV90aXRsZSB9XHJcbiAqL1xyXG4vLyBleHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXEpe1xyXG4vLyAgIGNvbnN0IHsgdXNlcl9pZCwgY291cnNlX2lkLCB1c2VyX25hbWUsIGNvdXJzZV90aXRsZSB9ID0gYXdhaXQgcmVxLmpzb24oKTtcclxuLy8gICBpZighdXNlcl9pZCB8fCAhY291cnNlX2lkKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ3VzZXJfaWQgJiBjb3Vyc2VfaWQgcmVxdWlyZWQnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbi8vICAgY29uc3QgY29kZSA9IGNyeXB0by5yYW5kb21CeXRlcyg2KS50b1N0cmluZygnaGV4JykudG9VcHBlckNhc2UoKTtcclxuLy8gICBjb25zdCBwZGZVcmwgPSBhd2FpdCBnZW5lcmF0ZUNlcnRpZmljYXRlUERGKHsgdXNlck5hbWU6IHVzZXJfbmFtZSB8fCAnU3R1ZGVudCcsIGNvdXJzZVRpdGxlOiBjb3Vyc2VfdGl0bGUgfHwgJ0NvdXJzZScsIGNvZGUgfSk7XHJcblxyXG4vLyAgIGNvbnN0IGFkbWluID0gc3VwYWJhc2VBZG1pbigpO1xyXG4vLyAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IGFkbWluLmZyb20oJ2NlcnRpZmljYXRlcycpLmluc2VydCh7IHVzZXJfaWQsIGNvdXJzZV9pZCwgY29kZSwgcGRmX3VybDogcGRmVXJsIH0pLnNlbGVjdCgpLnNpbmdsZSgpO1xyXG4vLyAgIGlmKGVycm9yKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4vLyAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGNlcnRpZmljYXRlOiBkYXRhIH0pO1xyXG4vLyB9XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXEpe1xyXG4gIGNvbnN0IHsgdXNlcl9pZCwgY291cnNlX2lkLCB1c2VyX25hbWUsIGNvdXJzZV90aXRsZSB9ID0gYXdhaXQgcmVxLmpzb24oKTtcclxuICBpZighdXNlcl9pZCB8fCAhY291cnNlX2lkKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICd1c2VyX2lkICYgY291cnNlX2lkIHJlcXVpcmVkJyB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG5cclxuICBjb25zdCBjb2RlID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDYpLnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICBjb25zdCBwZGZVcmwgPSBhd2FpdCBnZW5lcmF0ZUNlcnRpZmljYXRlUERGKHtcclxuICAgIHVzZXJOYW1lOiB1c2VyX25hbWUgfHwgJ1N0dWRlbnQnLFxyXG4gICAgY291cnNlVGl0bGU6IGNvdXJzZV90aXRsZSB8fCAnQ291cnNlJyxcclxuICAgIGNvZGVcclxuICB9KTtcclxuXHJcbiAgY29uc3QgYWRtaW4gPSBzdXBhYmFzZUFkbWluKCk7XHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgYWRtaW5cclxuICAgIC5mcm9tKCdjZXJ0aWZpY2F0ZXMnKVxyXG4gICAgLmluc2VydCh7IHVzZXJfaWQsIGNvdXJzZV9pZCwgY29kZSwgcGRmX3VybDogcGRmVXJsIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKTtcclxuXHJcbiAgaWYoZXJyb3IpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSk7XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgY2VydGlmaWNhdGU6IGRhdGEgfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInN1cGFiYXNlQWRtaW4iLCJnZW5lcmF0ZUNlcnRpZmljYXRlUERGIiwiY3J5cHRvIiwiUE9TVCIsInJlcSIsInVzZXJfaWQiLCJjb3Vyc2VfaWQiLCJ1c2VyX25hbWUiLCJjb3Vyc2VfdGl0bGUiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJjb2RlIiwicmFuZG9tQnl0ZXMiLCJ0b1N0cmluZyIsInRvVXBwZXJDYXNlIiwicGRmVXJsIiwidXNlck5hbWUiLCJjb3Vyc2VUaXRsZSIsImFkbWluIiwiZGF0YSIsImZyb20iLCJpbnNlcnQiLCJwZGZfdXJsIiwic2VsZWN0Iiwic2luZ2xlIiwibWVzc2FnZSIsImNlcnRpZmljYXRlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/certificates/issue/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/certificates.js":
/*!*****************************!*\
  !*** ./lib/certificates.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateCertificatePDF: () => (/* binding */ generateCertificatePDF)\n/* harmony export */ });\n/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dayjs */ \"(rsc)/./node_modules/dayjs/dayjs.min.js\");\n/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _supabase_server_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./supabase-server.js */ \"(rsc)/./lib/supabase-server.js\");\n\n\n/**\r\n * For production, install puppeteer (or @sparticuz/chromium for edge), then:\r\n * import puppeteer from 'puppeteer';\r\n * render HTML -> PDF -> upload to Supabase Storage.\r\n * Here we return a mock URL for local dev if puppeteer is not installed.\r\n */ // export async function generateCertificatePDF({ userName, courseTitle, code }){\n//   const bucket = process.env.SUPABASE_CERT_BUCKET || 'certificates';\n//   // Fallback: simple PDF-less placeholder file\n//   const admin = supabaseAdmin();\n//   const content = Buffer.from(`Certificate\\nName: ${userName}\\nCourse: ${courseTitle}\\nCode: ${code}\\nIssued: ${dayjs().toISOString()}`);\n//   const path = `${code}.txt`;\n//   const { error } = await admin.storage.from(bucket).upload(path, content, { upsert: true, contentType: 'text/plain' });\n//   if(error) throw error;\n//   const { data } = admin.storage.from(bucket).getPublicUrl(path);\n//   return data.publicUrl;\n// }\nasync function generateCertificatePDF({ userName, courseTitle, code }) {\n    const bucket = process.env.SUPABASE_CERT_BUCKET || \"certificates\";\n    const admin = (0,_supabase_server_js__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin)();\n    // Sekarang masih dummy TXT, belum PDF beneran\n    const content = Buffer.from(`Certificate\\nName: ${userName}\\nCourse: ${courseTitle}\\nCode: ${code}\\nIssued: ${dayjs__WEBPACK_IMPORTED_MODULE_0___default()().toISOString()}`);\n    const path = `${code}.txt`;\n    const { error } = await admin.storage.from(bucket).upload(path, content, {\n        upsert: true,\n        contentType: \"text/plain\"\n    });\n    if (error) throw error;\n    const { data } = admin.storage.from(bucket).getPublicUrl(path);\n    return data.publicUrl;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvY2VydGlmaWNhdGVzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMEI7QUFDMkI7QUFFckQ7Ozs7O0NBS0MsR0FFRCxpRkFBaUY7QUFDakYsdUVBQXVFO0FBQ3ZFLGtEQUFrRDtBQUNsRCxtQ0FBbUM7QUFDbkMsNElBQTRJO0FBQzVJLGdDQUFnQztBQUNoQywySEFBMkg7QUFDM0gsMkJBQTJCO0FBQzNCLG9FQUFvRTtBQUNwRSwyQkFBMkI7QUFDM0IsSUFBSTtBQUVHLGVBQWVFLHVCQUF1QixFQUFFQyxRQUFRLEVBQUVDLFdBQVcsRUFBRUMsSUFBSSxFQUFFO0lBQzFFLE1BQU1DLFNBQVNDLFFBQVFDLEdBQUcsQ0FBQ0Msb0JBQW9CLElBQUk7SUFDbkQsTUFBTUMsUUFBUVQsa0VBQWFBO0lBRTNCLDhDQUE4QztJQUM5QyxNQUFNVSxVQUFVQyxPQUFPQyxJQUFJLENBQ3pCLENBQUMsbUJBQW1CLEVBQUVWLFNBQVMsVUFBVSxFQUFFQyxZQUFZLFFBQVEsRUFBRUMsS0FBSyxVQUFVLEVBQUVMLDRDQUFLQSxHQUFHYyxXQUFXLEdBQUcsQ0FBQztJQUczRyxNQUFNQyxPQUFPLENBQUMsRUFBRVYsS0FBSyxJQUFJLENBQUM7SUFFMUIsTUFBTSxFQUFFVyxLQUFLLEVBQUUsR0FBRyxNQUFNTixNQUFNTyxPQUFPLENBQ2xDSixJQUFJLENBQUNQLFFBQ0xZLE1BQU0sQ0FBQ0gsTUFBTUosU0FBUztRQUFFUSxRQUFRO1FBQU1DLGFBQWE7SUFBYTtJQUVuRSxJQUFJSixPQUFPLE1BQU1BO0lBRWpCLE1BQU0sRUFBRUssSUFBSSxFQUFFLEdBQUdYLE1BQU1PLE9BQU8sQ0FBQ0osSUFBSSxDQUFDUCxRQUFRZ0IsWUFBWSxDQUFDUDtJQUN6RCxPQUFPTSxLQUFLRSxTQUFTO0FBQ3ZCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tpbGx1cGlkLW5leHQtcHJvZC8uL2xpYi9jZXJ0aWZpY2F0ZXMuanM/NDU2ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnO1xyXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnLi9zdXBhYmFzZS1zZXJ2ZXIuanMnO1xyXG5cclxuLyoqXHJcbiAqIEZvciBwcm9kdWN0aW9uLCBpbnN0YWxsIHB1cHBldGVlciAob3IgQHNwYXJ0aWN1ei9jaHJvbWl1bSBmb3IgZWRnZSksIHRoZW46XHJcbiAqIGltcG9ydCBwdXBwZXRlZXIgZnJvbSAncHVwcGV0ZWVyJztcclxuICogcmVuZGVyIEhUTUwgLT4gUERGIC0+IHVwbG9hZCB0byBTdXBhYmFzZSBTdG9yYWdlLlxyXG4gKiBIZXJlIHdlIHJldHVybiBhIG1vY2sgVVJMIGZvciBsb2NhbCBkZXYgaWYgcHVwcGV0ZWVyIGlzIG5vdCBpbnN0YWxsZWQuXHJcbiAqL1xyXG5cclxuLy8gZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQ2VydGlmaWNhdGVQREYoeyB1c2VyTmFtZSwgY291cnNlVGl0bGUsIGNvZGUgfSl7XHJcbi8vICAgY29uc3QgYnVja2V0ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfQ0VSVF9CVUNLRVQgfHwgJ2NlcnRpZmljYXRlcyc7XHJcbi8vICAgLy8gRmFsbGJhY2s6IHNpbXBsZSBQREYtbGVzcyBwbGFjZWhvbGRlciBmaWxlXHJcbi8vICAgY29uc3QgYWRtaW4gPSBzdXBhYmFzZUFkbWluKCk7XHJcbi8vICAgY29uc3QgY29udGVudCA9IEJ1ZmZlci5mcm9tKGBDZXJ0aWZpY2F0ZVxcbk5hbWU6ICR7dXNlck5hbWV9XFxuQ291cnNlOiAke2NvdXJzZVRpdGxlfVxcbkNvZGU6ICR7Y29kZX1cXG5Jc3N1ZWQ6ICR7ZGF5anMoKS50b0lTT1N0cmluZygpfWApO1xyXG4vLyAgIGNvbnN0IHBhdGggPSBgJHtjb2RlfS50eHRgO1xyXG4vLyAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IGFkbWluLnN0b3JhZ2UuZnJvbShidWNrZXQpLnVwbG9hZChwYXRoLCBjb250ZW50LCB7IHVwc2VydDogdHJ1ZSwgY29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyB9KTtcclxuLy8gICBpZihlcnJvcikgdGhyb3cgZXJyb3I7XHJcbi8vICAgY29uc3QgeyBkYXRhIH0gPSBhZG1pbi5zdG9yYWdlLmZyb20oYnVja2V0KS5nZXRQdWJsaWNVcmwocGF0aCk7XHJcbi8vICAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xyXG4vLyB9XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVDZXJ0aWZpY2F0ZVBERih7IHVzZXJOYW1lLCBjb3Vyc2VUaXRsZSwgY29kZSB9KXtcclxuICBjb25zdCBidWNrZXQgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9DRVJUX0JVQ0tFVCB8fCAnY2VydGlmaWNhdGVzJztcclxuICBjb25zdCBhZG1pbiA9IHN1cGFiYXNlQWRtaW4oKTtcclxuXHJcbiAgLy8gU2VrYXJhbmcgbWFzaWggZHVtbXkgVFhULCBiZWx1bSBQREYgYmVuZXJhblxyXG4gIGNvbnN0IGNvbnRlbnQgPSBCdWZmZXIuZnJvbShcclxuICAgIGBDZXJ0aWZpY2F0ZVxcbk5hbWU6ICR7dXNlck5hbWV9XFxuQ291cnNlOiAke2NvdXJzZVRpdGxlfVxcbkNvZGU6ICR7Y29kZX1cXG5Jc3N1ZWQ6ICR7ZGF5anMoKS50b0lTT1N0cmluZygpfWBcclxuICApO1xyXG5cclxuICBjb25zdCBwYXRoID0gYCR7Y29kZX0udHh0YDtcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgYWRtaW4uc3RvcmFnZVxyXG4gICAgLmZyb20oYnVja2V0KVxyXG4gICAgLnVwbG9hZChwYXRoLCBjb250ZW50LCB7IHVwc2VydDogdHJ1ZSwgY29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyB9KTtcclxuXHJcbiAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcclxuXHJcbiAgY29uc3QgeyBkYXRhIH0gPSBhZG1pbi5zdG9yYWdlLmZyb20oYnVja2V0KS5nZXRQdWJsaWNVcmwocGF0aCk7XHJcbiAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJkYXlqcyIsInN1cGFiYXNlQWRtaW4iLCJnZW5lcmF0ZUNlcnRpZmljYXRlUERGIiwidXNlck5hbWUiLCJjb3Vyc2VUaXRsZSIsImNvZGUiLCJidWNrZXQiLCJwcm9jZXNzIiwiZW52IiwiU1VQQUJBU0VfQ0VSVF9CVUNLRVQiLCJhZG1pbiIsImNvbnRlbnQiLCJCdWZmZXIiLCJmcm9tIiwidG9JU09TdHJpbmciLCJwYXRoIiwiZXJyb3IiLCJzdG9yYWdlIiwidXBsb2FkIiwidXBzZXJ0IiwiY29udGVudFR5cGUiLCJkYXRhIiwiZ2V0UHVibGljVXJsIiwicHVibGljVXJsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/certificates.js\n");

/***/ }),

/***/ "(rsc)/./lib/supabase-server.js":
/*!********************************!*\
  !*** ./lib/supabase-server.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nfunction supabaseAdmin() {\n    const url = \"https://gneffrsbfjajsipxogqt.supabase.co\";\n    const key = process.env.SUPABASE_SERVICE_ROLE;\n    if (!url || !key) throw new Error(\"Supabase admin env missing\");\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, key, {\n        auth: {\n            autoRefreshToken: false,\n            persistSession: false\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2Utc2VydmVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXFEO0FBRTlDLFNBQVNDO0lBQ2QsTUFBTUMsTUFBTUMsMENBQW9DO0lBQ2hELE1BQU1HLE1BQU1ILFFBQVFDLEdBQUcsQ0FBQ0cscUJBQXFCO0lBQzdDLElBQUcsQ0FBQ0wsT0FBTyxDQUFDSSxLQUFLLE1BQU0sSUFBSUUsTUFBTTtJQUNqQyxPQUFPUixtRUFBWUEsQ0FBQ0UsS0FBS0ksS0FBSztRQUFFRyxNQUFNO1lBQUVDLGtCQUFrQjtZQUFPQyxnQkFBZ0I7UUFBTTtJQUFFO0FBQzNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tpbGx1cGlkLW5leHQtcHJvZC8uL2xpYi9zdXBhYmFzZS1zZXJ2ZXIuanM/ZGJhYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1cGFiYXNlQWRtaW4oKXtcclxuICBjb25zdCB1cmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XHJcbiAgY29uc3Qga2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFO1xyXG4gIGlmKCF1cmwgfHwgIWtleSkgdGhyb3cgbmV3IEVycm9yKCdTdXBhYmFzZSBhZG1pbiBlbnYgbWlzc2luZycpO1xyXG4gIHJldHVybiBjcmVhdGVDbGllbnQodXJsLCBrZXksIHsgYXV0aDogeyBhdXRvUmVmcmVzaFRva2VuOiBmYWxzZSwgcGVyc2lzdFNlc3Npb246IGZhbHNlIH0gfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlQWRtaW4iLCJ1cmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwia2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFIiwiRXJyb3IiLCJhdXRoIiwiYXV0b1JlZnJlc2hUb2tlbiIsInBlcnNpc3RTZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase-server.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions","vendor-chunks/dayjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcertificates%2Fissue%2Froute&page=%2Fapi%2Fcertificates%2Fissue%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcertificates%2Fissue%2Froute.js&appDir=D%3A%5Cgithub%5Cskillupid-next-prod%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Cgithub%5Cskillupid-next-prod&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();