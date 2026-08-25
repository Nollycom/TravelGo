package com.travgo.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onBackPressed() {
        // Si WebView peut revenir en arrière, on navigue, sinon comportement par défaut (exit sur home)
        if (bridge != null && bridge.getWebView() != null) {
            WebView wv = bridge.getWebView();
            if (wv.canGoBack()) {
                wv.goBack();
                return;
            }
        }
        super.onBackPressed();
    }
}
