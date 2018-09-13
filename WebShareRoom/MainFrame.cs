using Fleck;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
//https://blog.csdn.net/liuhelong/article/details/8789392
namespace WebShareRoom
{
    public partial class MainFrame : Form
    {
        public MainFrame()
        {
            InitializeComponent();
        }

        WebSocketServer server = null;
        Queue<Object> msgqueue = new Queue<object>();//保存消息的列表
        private void button1_Click(object sender, EventArgs e)
        {
            LogInfoInvoke("服务正在运行：运行参数，" + comboBox1.Text + "," + textBox1.Text.ToString());
            FleckLog.Level = LogLevel.Debug;
            //var allSockets = new List<T_Entity>();
            var allSockets = new Dictionary<IWebSocketConnection, T_Entity>();
            if (comboBox1.Text.Equals("https"))
            {
                server = new WebSocketServer("wss://0.0.0.0:" + textBox1.Text.ToString());
            }
            else
            {
                server = new WebSocketServer("ws://0.0.0.0:" + textBox1.Text.ToString());
            }

            var flag = "私送";//私送,全体
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    LogInfoInvoke("Open!");

                    T_Entity t = new T_Entity()
                    {
                        from_id = (Guid.NewGuid().ToString("N")),
                        msgtype = "userenter",
                        onlineusercount = (allSockets.ToList().Count + 1).ToString(),
                        pcontent = "欢迎来到柒月风华聊天室",
                        from_headimg = "img/admin.jpg",
                        from_name = "柒月凤华网-助手"
                    };
                    socket.Send(JsonConvert.SerializeObject(t));
                    allSockets.Add(socket, t);
                };
                socket.OnClose = () =>
                {
                    LogInfoInvoke("Close!");
                    T_Entity t = allSockets[socket];
                    t.msgtype = "userexit";
                    t.onlineusercount = (allSockets.ToList().Count - 1).ToString();
                    t.pcontent = "用户" + t.from_name + "离开聊天室";
                    t.msgtype = "system_userexit";
                    allSockets.ToList().ForEach(s => {
                        s.Key.Send(JsonConvert.SerializeObject(t));
                    });
                    allSockets.Remove(socket);

                };
                socket.OnMessage = message =>
                {
                    LogInfoInvoke((message.Length > 300) ? message.Substring(0, 300) : message);
                    T_Entity t = new T_Entity();
                    try
                    {
                        t = JsonConvert.DeserializeObject<T_Entity>(message);
                        t.onlineusercount = allSockets.ToList().Count.ToString();

                        //构造新用户新进入消息
                        if (t.msgtype.Equals("userenter_reqgb"))
                        {
                            t.msgtype = "system_userenter";
                            t.postto_id = "";
                            t.pcontent = "欢迎，用户：" + t.from_name + "  进入聊天室";
                            allSockets[socket].from_name = t.from_name;
                            allSockets[socket].from_headimg = t.from_headimg;
                        }

                        //获取当前在线用户
                        if (t.msgtype.Equals("getOnlineUsers"))
                        {
                            t.msgtype = "system_getOnlineUsers";
                            Hashtable ht = new Hashtable();
                            allSockets.ToList().ForEach(s => {
                                ht.Add(s.Value.from_id, s.Value.from_name);
                            });
                            t.postto_id = t.from_id;
                            t.from_id = "";
                            t.pcontent = JsonConvert.SerializeObject(ht);
                        }


                        //获取消息
                        if (t.msgtype.Equals("getPreMessage"))
                        {
                            t.msgtype = "system_getPreMessage";
                            t.pcontent = JsonConvert.SerializeObject(msgqueue);
                            t.postto_id = t.from_id;//私发送
                            t.from_id = "";
                        }


                        if (t.msgtype.Equals("") || t.msgtype.Equals("message"))
                        {
                            if (!t.postto_id.Equals(""))
                            {
                                t.msgtype = "message_sf";
                            }
                            else
                            {
                                t.msgtype = "message";
                            }

                        }


                        if (!t.postto_id.Equals(""))
                        {
                            flag = "私送";
                        }
                        else
                        {
                            flag = "全体";
                        }
                        //单独发送
                        if (flag.Equals("私送"))
                        {
                            allSockets.ToList().ForEach(s => {
                                if (s.Value.from_id.Equals(t.postto_id))
                                {
                                    s.Key.Send(JsonConvert.SerializeObject(t));//私法
                                }
                            });
                        }
                        else if (flag.Equals("全体"))//全体发送
                        {
                            allSockets.ToList().ForEach(s => {
                                s.Key.Send(JsonConvert.SerializeObject(t));

                            });
                            //加入到消息列表中
                            if (t.msgtype.Equals("message"))
                            {
                                msgqueue.Enqueue(t);
                                if (msgqueue.Count > Convert.ToInt32(txt_msgcount.Text))
                                {
                                    msgqueue.Dequeue();
                                }

                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        LogInfoInvoke(ex.ToString());
                    }

                };
                socket.OnBinary = file => {
                    string path = ("D:/test.txt");
                    //创建一个文件流
                    FileStream fs = new FileStream(path, FileMode.Create);
                    //将byte数组写入文件中
                    fs.Write(file, 0, file.Length);
                    //所有流类型都要关闭流，否则会出现内存泄露问题
                    fs.Close();
                };
            });

        }

        private void button2_Click(object sender, EventArgs e)
        {

        }

        //定义文本框记录日志
        private delegate void LogInfoDelegate(string msg);
        private void LogInfoInvoke(string msg)
        {
            this.Invoke(new LogInfoDelegate(LogInfo), msg);
        }
        private void LogInfo(string msg)
        {
            if (this.txt_log.Text.Length > 90000000) { this.txt_log.Text = ""; }
            this.txt_log.Text += msg + "\r\n";
        }


    }


    class T_Entity
    {
        public string msgtype { get; set; }
        public string onlineusercount { get; set; }
        public string postto_id { get; set; }
        public string postto_name { get; set; }
        public string postto_headimg { get; set; }
        public string from_id { get; set; }
        public string from_name { get; set; }
        public string from_headimg { get; set; }
        public string pcontent { get; set; }
        public string posttime { get; set; }
    }
}
