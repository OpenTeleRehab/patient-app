package org.hi.patient

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*

class ForegroundServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundService"
    }

    @ReactMethod
    fun startService() {
        val serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java)
        reactApplicationContext.startService(serviceIntent)
    }

    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}
