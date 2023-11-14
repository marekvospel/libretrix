
package org.libretrix.libretrix.push

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import androidx.annotation.NonNull
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationCompat.MessagingStyle
import android.app.NotificationManager
import androidx.core.app.NotificationManagerCompat
import android.app.NotificationChannel
import android.app.Notification
import android.content.Context
import org.libretrix.libretrix.R

class PushService : FirebaseMessagingService() {

  override fun onNewToken(token: String) {
    Log.d("PushService", "New Firebase token $token")
  }

  override fun onMessageReceived(message: RemoteMessage) {
    Log.d("PushService", "Message received ${message.data}")

    val channel = NotificationChannel("messages", "Messages", NotificationManager.IMPORTANCE_DEFAULT)
    val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    notificationManager.createNotificationChannel(channel)

    val oldNotif = notificationManager.activeNotifications.find { it.tag == message.data["room_id"] }
    var messagingStyle: NotificationCompat.MessagingStyle? = null
    if (oldNotif !== null) {
      messagingStyle = NotificationCompat.MessagingStyle.extractMessagingStyleFromNotification(oldNotif.notification)
    }
    val notif: Notification

    val decryptable = message.data["type"] === "m.room.encrypted"

    var decrypted = message.data["content"]

    if (decryptable) {
    }

    Log.d("PushService", "Message decrypted: $decrypted")

    if (messagingStyle != null) {
      // Add new message to existing notification
      messagingStyle.addMessage(message.data["event_id"], 0, message.data["sender_display_name"] as String)
      val builder = NotificationCompat.Builder(this, "messages")
        .setSmallIcon(R.mipmap.ic_launcher)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setStyle(messagingStyle)
        .setGroup("org.libretrix.libretrix.MESSAGES")
        .setAutoCancel(true)

      notif = builder.build()
    } else {
      val builder = NotificationCompat.Builder(this, "messages")
        .setSmallIcon(R.mipmap.ic_launcher)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setStyle(MessagingStyle("You")
          .addMessage(message.data["event_id"], 0, message.data["sender_display_name"] as String))
        .setGroup("org.libretrix.libretrix.MESSAGES")
        .setAutoCancel(true)

      notif = builder.build()
    }

    notificationManager.notify(message.data["room_id"], 1, notif)
  }

}