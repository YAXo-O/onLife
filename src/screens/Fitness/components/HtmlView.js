import React, { useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import WebView from 'react-native-webview';

const wrapHtml = content => {
	if (!content) {
		return null;
	}

	content = content.replace(/(<table.+?<\/table>)/gsi, '<div class="table-wrapper">$1</div>');

	return `<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

html {
    font-size: 14px;
    padding: 0;
    margin: 0;
}

body { 
    padding: 15px;
    margin: 0;
    font-family: ${Platform.select({ios: 'Arial', android: 'Roboto'})}
}

h1 {
    font-size: 18px;
}

p {
    font-weight: 400;    
    font-size: 15px;
    line-height: 20px;
    margin-bottom: 15px;
}

ul {
  list-style: disc;
  padding: 0;
  margin: 0;
}
ul li {
  list-style: disc;
  margin-left: 15px;
  margin-bottom: 10px;
  font-size: 15px;
}

img {
    max-width: 100%;
}

table {
    border-spacing: 0;
    border-collapse: collapse;
}

table tr th {
    font-size: 13px;
    font-weight: 500;
    padding: 8px 2px;
    border-bottom: 2px solid black;
    text-align: left;    
}

table tr {
        
}
table tr td {
    font-size: 13px;   
    border-bottom: 1px solid silver;
    padding: 8px 6px 8px 2px;
    vertical-align: top;
}

.table-wrapper {
    overflow-x: auto;
    margin-left: -15px;
    padding-left: 15px;
    margin-right: -15px;
    padding-right: 15px;
    background-image: linear-gradient(to right, white, white), linear-gradient(to right, white, white), linear-gradient(to right, rgba(0, 0, 20, .30), rgba(255, 255, 255, 0)), linear-gradient(to left, rgba(0, 0, 20, .30), rgba(255, 255, 255, 0));
  /* Shadows */
  /* Shadow covers */
  background-position: left center, right center, left center, right center;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 20px 100%, 20px 100%, 10px 100%, 10px 100%;
  background-attachment: local, local, scroll, scroll;
}

</style>
<script>
  function waitForBridge() {
    if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage || !document.body) {
      setTimeout(waitForBridge, 200);
    } else {
      window.ReactNativeWebView.postMessage(
        Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)
      );
    }
  }
  waitForBridge();
</script>
${content}
</html>`;
};

export default function({ html, autoHeight, width, height, defaultHeight = 200 }) {
	const webviewRef = useRef(null);
	const [webViewHeight, setWebViewHeight] = useState(defaultHeight);

	const h = autoHeight ? webViewHeight : defaultHeight;

	// const handleLoadRequest = (event) => {
	// 	if (event.url !== 'file:///android_res/') {
	// 		Linking.openURL(event.url);
	// 		return false;
	// 	}
	// 	return true;
	// };

	const handleMessage = e => {
		setWebViewHeight(parseInt(e.nativeEvent.data));
	};

	return (
		<React.Fragment>
			<WebView
				style={{width: '100%', height: h}}
				javaScriptEnabled={true}
				onMessage={handleMessage}
				source={{html: wrapHtml(html)}}
				onStartShouldSetResponder={() => true}
				ref={webviewRef}
				// onShouldStartLoadWithRequest={handleLoadRequest}
			/>
		</React.Fragment>
	);
}
