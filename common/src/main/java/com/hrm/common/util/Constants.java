/**
 * @title constants.java
 * @package com.ttcloud.common.util
 * @description 常量管理
 * @author AaronFeng
 * @update 2012-4-19 上午 11:17:30
 * @version V1.0
 */
package com.hrm.common.util;

/**
 * @description 系统中的常量在此定义
 * @version 1.0
 * @author AaronFeng
 * @update 2012-4-19 上午 11:17:30
 */
public class Constants {

	//当前登录用户
	public static String LOGIN_CURRENTUSER = "currentUser";
	
	//前台用户
	public static String USER = "user";
	public static int SPECIAL_USER = 1;//特殊用户
	
	public static int MAIL_SENDED = 1;//邮件已发送
	public static int MAIL_UNSEND = 0;//邮件未发送
	
	public static int IP_RANGE_NORMAL = 0; //普通ip段
	public static int IP_RANGE_NETWORK = 1;  //外网ip段
	
	//后台用户
	public static String ADMIN = "admin";
	//操作系统
	public static String WINDOWS = "windows";
	public static String LINUX = "linux";
	
	//订单付费类型(1：按月)
	public static String scPriceType_MONTH = "1";
	
	//分页显示时，每页显示的数量
	public static final int PAGE_NUM = 10;
	
	public static String OPTIONS_SUCCESS="00000";//00000=操作成功
	public static String SECURITY_INUSE="SECURITY_INUSE";//SECURITY_INUSE：安全组被占用
	
	public static String OPTIONS_FAILURE="00001";//00000=操作失败
	
	public static String OPTIONS_TIMEOUT="00002";//00000=系统连接超时
	//读取properties文件异常
	public static final String READ_PROPERTIES_EXCEPTION = "00003";
	
	//OM模块的变量定义
	public static String ORDER_NOT_FOUND_ERROR = "02000";
	
	//
	public static final String YUAN="元";
	
	public static final String VM_REFUND_ALL_FLAG="全额退款";
	public static final String VM_REFUND_PART_FLAG="部分退款";
	
	//Lan Type
	public static final String LAN_NOROUTED="nonrouted";//可路由Lan
	public static final String LAN_ROUTED="routed";//不可路由Lan
	
	//Network Type
	public static final String NETWORK_LAN="lan";//Lan类型
	public static final String NETWORK_WAN="wan";//Wan类型
	
	//VPDC Type
	public static final int VPDC_NOROUTE=0;//非路由模式
	public static final int VPDC_ROUTED=1;//路由模式
	
	//Object Type
	public static final int OBJECT_VM=0;//VM
	public static final int OBJECT_ROUTER=1;//Router
	
	//VPDC模块的常量定义
	public static String VM_RESIZE_CONFIRM="1";//虚拟机确认调整
	public static String VM_RESIZE_REVERT="0";//虚拟机取消调整
	public static int VM_ISENABLE_TURE = 0;//启用状态
	public static int VM_ISENABLE_FALSE_ADMIN = 1;//管理员手工禁用
	public static int VM_ISENABLE_FALSE_EXPIRE = 2;//使用期满系统自动禁用
	public static String VM_EXPIREREMIND_TIME="00";//每次该时间（单位：小时）发邮件提醒
	public static String CONFIG_VM_EXPIREREMINDTIME = "expireRemindTime";//虚拟机提醒时间点配置键
	public static String CONFIG_VM_beforeDayRemindForM = "beforeDayRemindForM";//虚拟机按月计费时提前提醒时长配置键
	public static String CONFIG_VM_beforeDayRemindForY = "beforeDayRemindForY";//虚拟机按年计费时提前提醒时长配置键
	public static String CONFIG_VM_afterDayTerminateVM = "afterDayTerminateVM";//虚拟机到期后几天删除配置键
	
	public static String CONFIG_TRY_VM_DISABLE_DAY = "TryVmDisableDay";//试用虚拟机到期后几天禁用配置键
	public static String CONFIG_TRY_VM_TERMINATE_DAY = "TryVmTerminateDay";//试用虚拟机到期后几天删除配置键
	public static String CONFIG_VM_DISABLE_DAY = "VmDisableDay";//虚拟机到期后几天禁用配置键
	public static String CONFIG_VM_TERMINATE_DAY = "VmTerminateDay";//虚拟机到期后几天删除配置键
	
	public static String VM_STATUS_SNAPSHOT = "IMAGE_SNAPSHOT";//虚拟机备份状态
	public static String VM_STATUS_BUILDING = "BUILDING";//虚拟机生成中
	public static String VM_STATUS_ACTIVE = "ACTIVE";//虚拟机活动
	public static String VM_STATUS_REPAIR = "OS_REPAIR";//虚拟机系统修复
	public static String VM_STATUS_DELETED = "DELETED";//虚拟机删除
	public static String VM_STATUS_SOFTDELETED = "SOFT-DELETE";//虚拟机假删除
	public static String VM_STATUS_REBUILDING = "REBUILDING";//虚拟机rebulid
	public static String VOLUME_STATUS_CREATING="CREATING";//volume 状态
	
	public static String VM_STATUS_MIGRATE = "VM_STATUS_MIGRATE";//虚拟机迁移状态
	public static String VM_STATUS_RESET = "VM_STATUS_RESET";//虚拟机重置状态
	public static String VM_MIGRATE_COLD ="COLD";// 虚拟机冷迁
	public static String VM_MIGRATE_LIVE ="LIVE";// 虚拟机热迁
	
	public static String VM_PERIOD_LOG_VERIFYTRY = "虚拟机试用审核通过";
	public static String VM_PERIOD_LOG_VERIFYDELAY = "虚拟机试用延期审核通过";
	public static String VM_PERIOD_LOG_EXTRADELAY = "虚拟机额外延期";
	public static String VM_PERIOD_LOG_REGULAR = "虚拟机转正";
	public static String VM_PERIOD_LOG_RENEWCOST = "虚拟机续费通过";
	public static String VM_PERIOD_LOG_QUIT = "虚拟机退款";
	public static String VM_PERIOD_LOG_TRYNOVERIFY = "虚拟机免审试用";
	public static String VM_PERIOD_LOG_BUY = "虚拟机购买";
	
	//JobServer对应方法名
	public static String JOBSERVER_METHOD_CrVMTry = "createVM_Try";
	public static String JOBSERVER_METHOD_CrVMBuy = "createVM_Buy";
	public static String JOBSERVER_METHOD_CrVMAdmin = "createVM_Admin";
	public static String JOBSERVER_METHOD_CrVMPublish = "createVM_Publish";
	public static String JOBSERVER_METHOD_CrVMNoRouterVPDC = "createVM_NoRouterVPDC";
	public static String JOBSERVER_METHOD_CrVMRouterVPDC = "createVM_RouterVPDC";
	public static String JOBSERVER_METHOD_DeVMReduce = "deleteVM_Refund";
	public static String JOBSERVER_METHOD_DeVMExpire = "deleteVM_Expire";
	public static String JOBSERVER_METHOD_DeVMAdmin = "deleteVM_Admin";
	public static String JOBSERVER_METHOD_DeVMInstance = "deleteVM_Instance_Admin";
	public static String JOBSERVER_METHOD_IPbind = "IP_Bind";
	public static String JOBSERVER_METHOD_IPdelete = "IP_Delete";
	public static String JOBSERVER_METHOD_IPreset = "IP_Reset";
	public static String JOBSERVER_METHOD_extDiskAdd = "extendedDisk_Add";
	public static String JOBSERVER_METHOD_deleteVolume = "deleteVolume";
	public static String JOBSERVER_METHOD_createVolume = "createVolume";
	public static String JOBSERVER_METHOD_extDiskDel = "extendedDisk_Delete";
	public static String JOBSERVER_METHOD_extDiskModify = "extendedDisk_Modify";//扩展盘修改
	public static String JOBSERVER_METHOD_attachVolume = "attachVolume";
	public static String JOBSERVER_METHOD_detachVolume = "detachVolume";
	public static String JOBSERVER_METHOD_VMReset = "VM_Reset";
	public static String JOBSERVER_METHOD_VMRebuild = "VM_Rebuild";//重置操作系统
	public static String JOBSERVER_METHOD_VMSYSPWD = "VM_ResetSysPwd";//重置操作密码
	public static String JOBSERVER_METHOD_VMOpen = "VM_Open";
	public static String JOBSERVER_METHOD_VMClose = "VM_Close";
	public static String JOBSERVER_METHOD_VMReboot = "VM_Reboot";
	public static String JOBSERVER_METHOD_VMBackup = "VM_Backup";
	public static String JOBSERVER_METHOD_VMReduce = "VM_Reduce";
	public static String JOBSERVER_METHOD_VMOSRepair = "VM_OSRepair";//系统修复
	public static String JOBSERVER_METHOD_VMRecycleRestore = "VM_RecycleRestore";//回收站恢复
	public static String JOBSERVER_METHOD_VMRecycleDelete = "VM_RecycleDelete";//回收站彻底删除
	public static String JOBSERVER_METHOD_VMMigrate = "VM_Migrate";//迁移
	public static String JOBSERVER_METHOD_RouterOpen = "Router_Open";//启动路由
	public static String JOBSERVER_METHOD_RouterClose = "Router_Close";//关闭路由
	public static String JOBSERVER_METHOD_RouterReboot = "Router_Reboot";//重启路由
	public static String JOBSERVER_METHOD_CrRouterBuy = "createRouter_Buy";//创建路由
	public static String JOBSERVER_METHOD_RouterAddVif = "routerAddVif";//路由绑定LanNetwork
	public static String JOBSERVER_METHOD_VMLiveMigrate = "VM_Live_Migrate";//动态迁移
	public static String JOBSERVER_METHOD_HotVMMigrate = "VM_HotMigrate";
	public static String JOBSERVER_METHOD_VMPauseVolume = "VM_PauseVolume";
	public static String JOBSERVER_METHOD_VMUnpauseVolume = "VM_UnPaseVolume";
	public static String JOBSERVER_METHOD_VolumeBackup = "volume_Backup";
	public static String JOBSERVER_METHOD_VolumeRestore = "volume_Restore";
	public static String JOBSERVER_METHOD_VolumeSnapshoDelete = "volumeSnapshot_Delete";
	
	
	public static String VM_RENEW_RESULT_SUCC="true";//虚拟机续费成功
	public static String VM_RENEW_RESULT_FAIL="false";//虚拟机续费失败
	public static String VM_RENEW_RESULT_NOFEE="notEnough";//虚拟机续费余额不足
	public static String VM_RENEW_RESULT_INVALID_FEETYPE="Can not find the feeType";
	public static String VM_RENEW_RESULT_INVALID_PAYMODE="Can not find the paymode";
	
	public static String VM_ERROR_STATUS = "03000";//对应ApplicatinResources中的"03000=虚拟机状态错误"
	public static String VM_OPENSTACK_API_ERROR="03010";//03010=openStack API 异常
	public static String VM_OPSEXCEPTION="03011";//03011=openStack API 没有取到instance的信息
	public static String VM_UPDATE_VMNAME_EXCEPTION="03012";//03012 更新虚拟机别名异常
	public static String IMAGE_SIZE_GT_DISK_SIZE="07001";
	public static String VM_VOLUME_ATTACHE_DEV="/dev/vdd";
	public static String VM_UNDEPLOYED_STATUS="unDeployed";
	public static String VM_NOINSTANCE="noInstance";
	public static String EXCEPTION_OPS_DAO="03013";
	public static String VM_LIST_USER_ERROR="03024";
	public static String VM_LIST_ADMIN_ERROR="03025";
	public static String VM_CREATE_ADMIN_ERROR="03026";
	public static String VM_START_ERROR="03027";
	public static String VM_CLOSE_ERROR="03028";
	public static String VM_RESUME_ERROR="03029";
	public static String VM_VNC_ERROR="03030";
	public static String VM_BACKUP_ERROR="03031";
	public static String VM_BACKUP_PLAN_ERROR="03032";
	public static String VM_SNAPSHOT_DELETE_ERROR="03033";
	public static String VM_SNAPSHOT_GET_ERROR="03034";
	public static String VM_SNAPSHOT_LIST_ERROR="03035";
	public static String VM_RENEW_ERROR="03036";
	public static String VM_TERMINATE_ERROR="03037";
	public static String VM_PUBLISH_ERROR="03038";
	public static String VM_UPDATENAME_ERROR="03039";
	public static String VM_DETAIL_ERROR="03040";
	public static String VM_REBOOT_ERROR="03041";
	public static String VM_AUTO_MIGRATE_ERROR ="03042";
	public static String VM_RESIZE_ERROR="03043";
	public static String VM_CONFIRM_MIGRATE_ERROR="03044";
	public static String VM_MONITOR_INFO_ERROR="03045";
	public static String VM_FREEZE_ERROR="03046";
	public static String VM_ACTIVE_ERROR="03047";
	public static String VM_FREEZE_NODO="03048";
	public static String VM_RENEW_ORDER="03049";
	public static String VM_GET_RENEW_ORDER="03050";
	public static String VM_RESETOS_ERROR="03051";
	public static String VM_UPDATE_VMOWNER_EXCEPTION="03052";//03052 更新虚拟机所有者异常
	public static String VM_TERMINATE_NOTACTIVE="03053";//删除虚拟机不是ACTIVE状态，不能正常删除
	public static String VM_TERMINATE_ALREADY="03054";//虚拟机已被删除
	public static String VM_RENEW_ORDER_AMOUNT="03055";//金额不足
	public static String VM_CPPWD_ERROR="03056";//控制面板密码设置失败
	public static String VM_EXPIRE="03057";//虚拟机过期
	public static String VM_IP_BIND_ERROR="03058";//虚拟机绑定IP错误
	public static String VM_APPLYDELAY_ERROR="03059";//试用VM申请延期失败
	public static String VM_REGULAR_ERROR="03060";//试用VM转正失败
	public static String VM_VERIFYTRY_ERROR="03061";//试用VM审核失败
	public static String VM_VERIFYDELAY_ERROR="03062";//试用VM延期审核失败
	public static String VM_EXTRADELAY_ERROR="03063";//试用VM额外延期失败
	public static String VM_CANCEL_ERROR="03064";//试用待审核VM取消失败
	public static String VM_NOT_STATUS="03065";//当前状态VM无法进行该项操作
	public static String VM_EXTRA_LONG="03066";//额外延期总时长超出限时30天
	public static String VM_NO_ACTIVE="03067";//
	public static String VM_CONFIRM_RESIZE_ERROR="03068";//确认调整错误
	public static String VM_RESEND_OPEN_EMAIL_ERROR="03069";//重新发送虚拟机开通邮件出现错误
	public static String VM_RESET_PASSWORD_ERROR="03070";//重置密码错误
	public static String VM_IN_VM_CLUSTER="001001";//当前机器已添加到集群中，不允许修改子网
	public static String VM_CREATE_USER_ERROR="03071";//前台创建VM错误
	public static String VM_IP_NO_ENOUGH="03072";//系统IP资源不足
	public static String VM_ZONE_NO_ENOUGH="03074";//系统ZONE资源不足
	public static String VM_CHANGE_SC_ERROR="03075";//vm变更套餐失败'
	public static String VM_VNC_CLIENT_PORT="03076";//无可用端口共VNC客户端使用
	public static String VM_REPAIR_ERROR="03077";//VM系统修复失败
	public static String VM_RECYCLE_RESTORE_ERROR="03078";//回收站恢复VM
	public static String VM_RECYCLE_DELETE_ERROR="03079";//回收站删除VM
	public static String VM_SECURE_ERROR="03080";//VM安全策略失败
	public static String VPDC_WANNETWORK_ERROR="03081";//创建WanNetwork错误
	public static String VPDC_CREATE_ERROR="03082";//创建VPDC错误
	public static String VPDC_UPDATE_ERROR="03083";//修改VPDC错误
	public static String VPDC_DETAIL_ERROR="03084";//获取VPDC详情错误
	public static String VPDC_DELETE_ERROR="03085";//删除VPDC错误
	public static String VPDC_HAS_UNRELEASED_RESOURCES="03086";//当前VPDC有未释放资源，禁止删除！
	public static String ROUTER_DETAIL_ERROR="03087";//获取Router详情错误
	public static String ROUTER_START_ERROR="03088";//启动路由失败
	public static String ROUTER_CLOSE_ERROR="03089";//关闭路由失败
	public static String ROUTER_REBOOT_ERROR="03090";//重启路由失败
	public static String ROUTER_CREATE_ERROR="03091";//创建路由异常
	public static String VLAN_CAPACITY_FULL="03092";//VLAN连接数已满，不能再添加VM
	public static String VPDC_WANNETWORK_useIP="03093";//WanNetwork可分配IP段中包含已用IP
	public static String SYSTEM_BUSY_NOW="03094";//系统忙稍后请重试(资源不足时提示)
	public static String VOLUME_BACKUP_ERROR="03095";//扩展盘备份失败
	public static String VOLUME_RESTORE_ERROR="03096";//扩展盘还原失败
	public static String VOLUME_SNAPSHOTS_LIST_ERROR="03097";
	public static String VOLUME_NO_BACKUP="03098";
	public static String VOLUME_SNAPSHOT_DELETE_ERROR="03099";
	

	
	
	//ServiceCatalog模块常量定义
	public static String SC_NOT_EXISTS="05000";
	public static String SC_NAME_EXISTS="05001";
	public static String SI_ISUESD="05010";
	public static String SI_EXISTS="05011";
	public static String CPU_CORE_EXISTS="CPU_CORE_EXISTS";
	public static String BRAND_WIDTH_EXISTS="BRAND_WIDTH_EXISTS";
	public static String NO_IMAGE_FOUND="05020";
	public static String DISK_SET_ERROR="05021";
	public static String NODE_NOT_EXIT="05030";
	public static final String SC_FIND_NODE_EXCEPTION = "05031";//无法发现节点信息
	public static final String SC_SAVE_NODE_EXCEPTION = "05032";//无法保存节点信息
	public static final String SC_DELETE_NODE_EXCEPTION = "05033";//无法删除节点信息
	public static final String SC_NODE_LIST_EXCEPTION = "05034";//无法获得节点列表信息
	public static String SC_ZONE_LIST_EXCEPTION = "05035";//无法获得Zone列表信息
	public static String SC_SAVE_ZONE_EXCEPTION = "05036";//无法保存Zone信息
	public static String SC_UPDATE_ZONE_EXCEPTION = "05037";//无法修改Zone信息
	public static String SC_DELETE_ZONE_EXCEPTION = "05038";//无法删除Zone信息
	public static String SC_SET_DEFAULT_ZONE_EXCEPTION = "05039";//设置默认Zone信息异常
	public static String SC_ZONE_USED_EXCEPTION = "05040";//Zone已经被使用异常
	public static String SC_ZONE_NAME_EXISTS="05041";//Zone名称已经存在异常
	public static String SC_ZONE_CODE_EXISTS="05042";//Zone编码已经存在异常
	public static String SC_SET_ZONE_STATUS_EXCEPTION = "05043";//启用或禁用Zone状态异常
	public static String SC_ZONEGROUP_LIST_EXCEPTION = "05044";//无法获得ZoneGroup列表信息
	public static String SC_SAVE_ZONEGROUP_EXCEPTION = "05045";//无法保存ZoneGroup信息
	public static String SC_UPDATE_ZONEGROUP_EXCEPTION = "05046";//无法修改ZoneGroup信息
	public static String SC_DELETE_ZONEGROUP_EXCEPTION = "05047";//无法删除ZoneGroup信息
	public static String SC_ZONEGROUP_USED_EXCEPTION = "05048";//ZoneGroup已经被使用异常
	public static String SC_ZONEGROUP_NAME_EXISTS="05049";//ZoneGroup名称已经存在异常
	public static String SC_ZONEGROUP_CODE_EXISTS="05050";//ZoneGroup编码已经存在异常
	public static String SC_SET_ZONEGROUP_STATUS_EXCEPTION = "05051";//启用或禁用ZoneGroup状态异常
	public static String SC_UPDATE_NODENAME_ERROR="05052";//更新节点名称错误
	public static String SC_NODE_NAME_EXISTS="05053";//节点别名已经存在异常
	public static String SC_CODE_EXISTS="05054";//套餐code存在异常
	public static String SC_OS_LIST_EXCEPTION = "05055";//获取OS异常
	public static String SC_VIRTUAL_TECHNOLOGY="05056";//名称已存在
	public static String SC_VIRTUAL_TECHNOLOGY_VERSION="05057";//版本已存在
	
	//用户模块常量
	public static final String ACCOUNT_NOT_FOUND= "01000"; //账户不存在
	public static final String ACCOUNT_IS_ENABLE="01001";//账户不可用
	public static final String EMAIL_HAD_HEEN_USED="01002";//邮箱已被占用
	public static final String IMAGE_HAD_HEEN_USED="IMAGE_HAD_HEEN_USED";//镜像已被占用
	public static final String NAME_HAD_HEEN_USED = "01003"; //名字已被占用
	public static final String INVALID_PASSWORD = "01004";
	public static final String ACCOUNT_IS_LOGOUT="01005";//账户已登出
	public static final String VERCODE_IS_ERROR = "01006";//验证码错误
	public static final String VERCODE_IS_NULL = "01014";//验证码为空
	public static final String REGISTER_IS_ERROR="01007";//注册失败
	public static final String USER_TYPE_ERROR="01008"; //用户类型错误
	public static final String ACCOUNT_IS_FREEZED="01009";//账户已冻结
	public static final String PASSWORD_IS_ERROR="01010"; //旧密码错误 
	public static final String PASSWORD_IS_DISABLE="01011";
	public static final String PASSWORD_ENCRYPTION_FAILED="01012";//加密失败
	public static final String ENTUSER_HAS_COMPANY="01013";//转企业用户必须不属于其它企业
	
	public static final String FAILED_TO_SEND_SMS_CODE="01015";//系统忙，请稍后再试
	public static final String VERIFICATION_CODE_HAS_EXPIRED="01016";//验证码已过期，请重新获取
	public static final String VERIFICATION_CODE_INCORRECT="01017";//验证码不正确，请重新填写
	public static final String CLICK_ON_BUTTON_TO_GET_CODE="01018";//您还没有获取验证码，请点击获取验证码按钮获取
	public static final String ACCOUNT_IS_NOT_ACTIVE="01019";//账号未激活，请先通过邮箱链接激活账号!
	public static final String PHONE_NUMBER_IS_NOT_EXISTED="01020";//手机号码不存在
	public static final String TELEPHONE_HAD_BEEN_USED="01021";//手机号码已被占用
	public static final String TOKEN_REGISTER_ERROR="01022";//租户注册失败
	
	//CMDB模块的变量定义
	public static String IP_USED = "10000";
	public static String IP_EXIST = "10001";
	public static int IP_STATUS_FREE = 0;//IP空闲状态
	public static int IP_STATUS_ASSIGNING = 1;//IP待分配状态
	public static int IP_STATUS_ASSIGNED = 2;//IP已分配状态
	public static int IP_STATUS_DISABLED = 3;//IP禁用状态
	public static int IP_STATUS_RELEASING = 4;//IP待释放状态
	
	public static final String QNAME4CLOUDLOG="logCloudQueue";
	public static final String QNAME_SERVICE_ITEM="hs_Q_app_maintain";
	
	public static final String EXCHANGE_TYPE="direct";
	public static final String EXCHANGE_NAME="hs_exc_direct";
	
	public static final long CACHE_TIME_OUT=2*60*60*1000;
	//定义密码长度
	public static final int PASSWORD_LEN = 7;
	
	//Token Expires
	public static int OPENSTACK_TOKEN_EXPIRES_DIFF = 60*60;//diff Minutes with OpenStack Expires time
	//监控请求间隔
	public static long OPENSTACK_REQUEST_INTERVAL = 30*1000;//30SECOND
	
	//虚拟机状态为0可用
	public static final long STATUS_ENABLE = 0;
	
	//超级角色
	public static final String SUPER_ROLE = "Role_SystemAdmin";
	//虚拟中心模块常量
	public static final String MONITOR_WHOLE_OVERVIEW_EXCEPTION = "03013";//无法获得全局监控信息
	public static final String MONITOR_HOST_OVERVIEW_EXCEPTION = "03014";//无法获得节点监控信息
	public static final String MONITOR_VM_OVERVIEW_EXCEPTION = "03015";//无法获得虚拟机监控信息
	public static final String MONITOR_HOST_DETAILS_EXCEPTION = "03016";//无法获得节点列表信息
	public static final String MONITOR_VM_DETAILS_EXCEPTION = "03017";//无法获得虚拟机列表信息
	public static final String MONITOR_VM_DETAIL_EXCEPTION = "03018";//无法获得虚拟机详情信息
	public static final String MONITOR_VM_HISTORY_EXCEPTION = "03019";//无法获得虚拟机历史监控信息
	public static final String MONITOR_HOST_HISTORY_EXCEPTION = "03020";//无法获得节点历史监控信息
	public static final String MONITOR_VM_REALTIME_EXCEPTION = "03021";//无法获得虚拟机实时监控信息
	public static final String MONITOR_HOST_VM_TREE_EXCEPTION = "03022";//无法获得虚拟中心管理树信息
	public static final String MONITOR_HOST_USAGE_EXCEPTION = "03023";//无法获得节点资源使用率信息
	public static final String MONITOR_REQUEST_EXCEPTION = "03045";//请求监控信息异常
	public static final String MONITOR_VM_SYSTEMDISK_DEVICE = "/dev/vda"; //系统盘设盘挂载点
	public static final String MONITOR_ZONE_OVERVIEW_EXCEPTION = "03073";//无法获得资源域监控信息
	//进程管理模块常量
	public static final String PROCESS_LIST_EXCEPTION = "04000";//无法获得进程列表信息
	public static final String PROCESS_START_EXCEPTION = "04001";//无法启动进程
	public static final String PROCESS_STOP_EXCEPTION = "04002";//无法停止进程
	
	
	
	//image管理异常常量
	public static final String IMAGE_EXCEPTION = "I0001";   //image异常
	public static final String IMAGE_ADD_EXCEPTION = "I0002";  //image添加异常
	public static final String IMAGE_DELETE_EXCEPTION = "I0003";  //image删除异常
	public static final String IMAGE_UPLOAD_LIST_EXCEPTION = "I0004"; //查询上传文件列表异常
	public static final String IMAGE_EDIT_EXCEPTION = "I0005";  //image删除异常
	public static final String IMAGE_INFO_EXCEPTION = "I0006";  //image信息异常
	
	//银行账号
	public static final String USER_BANK_EXCEPTION = "UB001";      //银行账号功能异常
	public static final String USER_BANK_SAVE_EXCEPTION = "UB002"; //保存银行账号异常
	public static final String USER_BANK_FIND_EXCEPTION = "UB003"; //银行账号查询异常
	
	
	//ip状态为可用
	public static final int IP_STATUS_ENABLED = 0;
	
	//企业角色ID
	public static final long Role_Enterprise_ID = 1L;
	//系统管理员角色ID
	public static final long Role_SYSTEM_ADMIN_ID = 2L;
	
	//OM-web-admin
	public static final String ORDER_PAGING_ERROR="OA000";
	public static final String ORDERITEM_DETAIL_ERROR="OA001";
	public static final String ORDER_CANCEL_ERROR="OA002";
	public static final String TRYORDER_PAGING_ERROR="OA003";
	public static final String TRYAUDIT_ERROR="OA004";
	public static final String DELAYAUDIT_ERROR="OA005";
	public static final String ORDERITEM_VM_LIST_ERROR="OA006";
	public static final String ORDER_PART_REFUND_ERROR="OA007";
	public static final String ORDER_REFUND_ALL_ERROR="OA008";
	public static final String VM_REFUND_ERROR="OA009";
	public static final String VM_REFUND_ALL_ERROR="OA010";
	public static final String GET_VM_RELATED_REFUNDABLE_ORDER_ERROR="OA012";
	public static final String GET_VM_RELATED_PAID_ORDER_ERROR="OA011";

	//OM-web-site
	public static final String ORDER_PAY_ERROR="OA003";
	public static final String ORDER_QUERY_SC_ERROR="OA004";
	public static final String SAVE_CART_ERROR ="OA005";
	public static final String SUBMIT_ORDER_ERROR="OA006";
	public static final String QUERY_ORDER_BY_CONDITION_ERROR="OA007";
	public static final String SUBMIT_TRY_VM_ERROR="OA008";
	public static final String REGULAR_APPLY_ERROR="OA009";
	public static final String DELAY_APPLY_ERROR="OA010";
	public static final String TO_NORMAL_ERROR="OA011";
	public static final String GET_TRY_ORDER_BY_PAGE_ERROR="OA012";
	public static final String VM_TO_NORMAL_GEN_ORDER_ERRIR="OA013";
	public static final String ORDER_PAY_SUCCESS="success";
	public static final String ORDER_NOT_ENOUGH="balance is not enough";
	public static final String APPLY_REFUND_ERROR="OA014";
	public static final String ORDER_COUPON_FORMAT_ERROR="OA015";
	public static final String UPGADE_VM_ERROR="OA018";
	public static final String CANCEL_ALL_UNPAID_ORDER_ERROR="OA017";
	public static final String UPGRADE_VM_BLANCE_NOT_ENOUGH="OA016";
	public static final String GIFT_FORMAT_ERROR="OA019";
	
	//UserManagement-admin
	public static final String GET_ALL_AMIND_ERROR="UA000";
	public static final String ADD_ADMIN_ERROR="UA002";
	public static final String MODIFY_ADMIN_ERROR="UA003";
	public static final String DELETE_ADMIN_ERROR="UA004";
	public static final String ENABLE_ADMIN_ERROR="UA006";
	public static final String RESET_ADMIN_PASSWD_ERROR="UA005";
	public static final String ADMIN_LOGIN_ERROR="UA007";
	public static final String GET_CURRENT_USER_ERROR="UA008";
	public static final String ADMIN_LOGOUT_ERROR="UA009";
	
	//UserManagement-User
	public static final String GET_USER_BY_PAGE_ERROR="UM000";
	public static final String LOAD_COUNTRY_ERROR="UM001";
	public static final String LOAD_REGION_ERROR="UM003";
	public static final String LOAD_INDUSTRY_ERROR="UM002";
	public static final String DELETE_USER_ERROR="UM004";
	public static final String ENABLE_USER_ERROR="UM008";
	public static final String RESET_USER_PASSWD_ERROR="UM005";
	public static final String ADD_USER_ERROR="UM006";
	public static final String MODIFY_USER_ERROR="UM007";
	public static final String INVITE_SENT ="UM008";
	public static final String INVITE_JOINED ="UM009";
	public static final String USER_NO_ACTIVE="UM010";
	public static final String DATEBASE_ACCESS_ERROR="UM011";
	public static final String ACCOUNT_NOUNIQUE="UM012";
	public static final String USER_RE_ACTIVATION_EMAIL="UM013";
	public static final String USER_ERR_URL="UM014";
	public static final String UNLOGGED = "UM111";
	public static final String DOMAIN_COPYRIGHT_EXCEPTION = "UM015";

	//MESSAGE
	public static final String MESSAGE_EXCEPTION = "M0001";
	public static final String MESSAGE_ADD_EXCEPTION = "M0002";
	public static final String MESSAGE_EDIT_STATUS_EXCEPTION = "M0003";
	public static final String MESSAGE_DELETE_EXCEPTION = "M0004";
	public static final String MESSAGE_FIND_EXCEPTION = "M0005";
	
	public static final String MESSAGE_INVOICE_APPROVE_SUCCESS = "您的发票申请经审核已通过，发票金额${money}元。";
	public static final String MESSAGE_INVOICE_APPROVE_FAIL = "您的发票申请经审核未通过，发票金额${money}元。";
	
	//SC
	public static final String GET_SC_BY_ID_ERROR="SC000";
	public static final String GET_OS_BY_ID_ERROR="SC001";
	public static final String SAVE_SC_ERROR="SC003";
	public static final String CHECK_SC_NAME_DUPLICATE_ERROR="SC004";
	public static final String GET_SC_BY_PAGE_ERROR="SC005";
	public static final String DISABLE_SC_ERROR="SC006";
	public static final String ENABLE_SC_ERROR="SC007";
	public static final String APPROVE_SC_ERROR="SC008";
	public static final String PACKAGE_LOCATION_UP_MOVE_ERROR="SC009";
	public static final String PACKAGE_LOCATION_DOWN_MOVE_ERROR="SC010";
	//siteconfig
	public static final String GET_SITE_CONFIG_ERROR="SIC001";
	public static final String ALLOW_DELAY_DAYS="allowDelayDays";//允许延期审批推迟天数
	//试用到期后，才进行延期审核，计算到期日期时的开始日期设置，是为当前日期还是为最初试用开始日期
	public static final String DELAY_BEGIN_DATE="delayBeginDate";
	
	//ROLE
	public static final String ROLE_EXCEPTION = "R0001"; //角色异常
	public static final String ROLE_CREATE_EXCEPTION = "R0002"; //角色创建异常
	public static final String ROLE_MODIFY_EXCEPTION = "R0003"; //角色赋权异常
	public static final String ROLE_DELETE_EXCEPTION = "R0004"; //角色删除异常
	public static final String ROLE_FIND_EXCEPTION = "R0005"; //角色查询异常
	public static final String ROLE_RESOURCE_TYPE_EXCEPTION = "R0006"; //查询resourceType异常
	public static final String ROLE_ACTION_EXCEPTION = "R0007"; //查询action异常
	
	//ICP
	public static final String ICP_EXCEPITON = "ICP001";
	public static final String ICP_GET_PROVINCE_EXCEPITON = "ICP002";
	
	//IP Exception
	public static final String IP_EXCEPTION = "IP0001";    //ip异常
	public static final String IP_RANGE_FIND_EXCEPTION = "IP0002"; //ip段查询异常
	public static final String IP_CREATE_EXCEPTION = "IP0003";
	public static final String IP_DELETE_EXCEPTION = "IP0004";
	public static final String IP_FIND_EXCEPTION = "IP0005";
	public static final String IP_UPDATE_STATUS_EXCEPTION = "IP0006";
	public static final String IP_NODE_SAME_EXCEPTION = "IP0007";
	public static final String IP_RANGE_INVALID = "IP0008";
	public static final String DELETE_SUBNET_ERROR = "DELETE_SUBNET_ERROR"; //删除子网失败
	
	//User brand
	public static final String DEFULT_BRAND_CODE="defaultBrand";
	public static final String ADD_USER_BRAND_ERROR="UB001";
	public static final String MODIFY_USER_BRAND_ERROR="UB002";
	public static final String GET_ALL_NORMAL_BRAND_ERROR="UB003";
	public static final String GET_ALL_BRAND_PAGING_ERROR="UB004";
	public static final String DELETE_USER_BRAND_ERROR="UB005";
	public static final String CHECK_BRAND_NAME_DUP_ERROR="UB006";
	public static final String ENABLE_USER_BRAND_ERROR="UB007";
	public static final String RELATED_USER_BRAND_SC_ERROR="UB008";
	public static final String UNRELATED_USER_BRAND_SC_ERROR="UB009";
	public static final String NO_USER_BRAND="UB010";
	
	//Marketing Promotion
	public static final String GET_MARKETINGPROMOTION_ERROR="MP001";
	public static final String CHECK_MARKETINGPROMOTIONNAMEDUP_ERROR="MP002";
	public static final String CHECK_MARKETINGPROMOTIONCODEDUP_ERROR="MP003";
	public static final String CHECK_MARKETINGPROMOTIONURLDUP_ERROR="MP004";
	public static final String ADD_MARKETINGPROMOTION_ERROR="MP005";
	public static final String MODIFYMARKETINGPROMOTION_ERROR="MP006";
	
	//announcement 
    public static final int ANNOUNCEMENT_INNER_TYPE = 0; //公告类别为站内
    public static final int ANNOUNCEMENT_OUTER_TYPE = 1; //公告类别为站外
    
    /*public static final int ANNOUNCEMENT_INNER_SHOW = 3; //站内公告显示条数
    public static final int ANNOUNCEMENT_INNER_MORE = 8; //站内公告more显示条数
    public static final int ANNOUNCEMENT_OUTER_SHOW = 2; //站外公告显示条数
*/    
    //announcement Exception
    public static final String ANNOUNCEMENT_EXCEPTION = "A00001";
    public static final String ANNOUNCEMENT_BEAN_EXCEPTION = "A00002"; //封装对象错误
    public static final String ANNOUNCEMENT_INNER_EXCEPTION = "A00003"; //显示站内公告错误
    public static final String ANNOUNCEMENT_OUTER_EXCEPTION = "A00004"; //显示站外公告错误
    public static final String ANNOUNCEMENT_MORE_EXCEPTION = "A00005";  //显示more公告错误
    //套餐资源-web-admin
    public static final String GET_SC_RESOURCE_ERROR="SI000";
    public static final String GET_SC_RESOURCE_BY_PAGE_ERROR="SI001";
    public static final String GET_ALL_IMAGE_ERROR="SI003";
    public static final String SAVE_SC_RESOURCE_ERROR="SI004";
    public static final String DELETE_SC_RESOURCE_ERROR="SI005";
    public static final String CHECK_SC_RESOURCE_NAME_DUP_ERROR="SI006";
    public static final String NODE_SEPARATOR_ZONE="\\$";
	
	//INVOICE EXCEPTION
    public static final String INVOICE_EXCEPTION = "I00001";
    public static final String INVOICE_BALANCE_EXCEPTION = "I00002"; //可开票总额不足
    public static final String INVOICE_APPLICATION_STATUS_EXCEPTION= "I00003"; //申请状态异常
    public static final String INVOICE_ACCOUNT_UNEXIST_EXCEPTION = "I00004"; //发票账户不存在
    public static final String INVOICE_NUMBER_EXIST_EXCEPTION = "IN0005"; //发票号已存在
    public static final String INVOICE_SEND_PRICE_EXCEPTION = "IN0006"; //用户账户余额不够发票邮寄费用
    public static final String INVOICE_APPROVAL_SUCCESS_EXCEPTION = "IN0007"; //发票审批通过异常
    
    //DOMAIN EXCEPTION
    public static final String DOMAIN_EXCEPTION = "D00001";
    public static final String DOMAIN_GET_ALL_EXCEPTION = "D00002"; //获取所有分平台错误
    public static final String DOMAIN_EDIT_EXCEPTION = "D00003";  //分平台编辑错误
    public static final String DOMAIN_DELETE_EXCEPTION = "D00004";  //分平台编辑错误
    public static final String DOMAIN_FIND_EXCEPTION = "D00005";   //分平台查询错误
    public static final String DOMAIN_CODE_EXIST = "D00006";   //分平台查询错误
    public static final String DOMAIN_NAME_EXIST = "D00007";   //分平台查询错误
    public static final String DOMAIN_ABBREVIATION_EXIST = "D00008";   //分平台查询错误
    
    //ACCESS_ACCOUNT_EXCEPTION
    public static final String ACCESS_ACCOUNT_EXCEPTION = "AA0001";
    public static final String ACCESS_ACCOUNT_EDIT_EXCEPTION = "AA0002";
    public static final String ACCESS_ACCOUNT_DELETE_EXCEPTION = "AA0003";
    public static final String ACCESS_ACCOUNT_FIND_EXCEPTION = "AA0004";
    
    //VROUTER TEMPLATE
    public static final String VROUTER_TEMPLATE_DELETE_EXCEPTION = "VT0001";
    public static final String VROUTER_TEMPLATE_EDIT_EXCEPTION = "VT0002";
    
    //NETWORK
    public static final String NETWORK_DELETE_EXCEPTION = "N00001";
    
    //STORAGE
    public static final String STORAGE_EXCEPTION = "S00001"; //云存储异常
    
    //MailTemplate
    public static final String MAIL_TEMPLATE_EXCEPTION = "MT0001";      //邮件模板异常
    public static final String MAIL_TEMPLATE_FIND_EXCEPTION = "MT0002"; //查找邮件模板异常
    public static final String MAIL_SENDER_ADD_EXCEPTION = "MS0001"; //创建邮件发送者异常
    
    public static final String MAIL_LOGO_SRC = "/resources/platform/"; //默认邮件图片格式
    
    //操作完成
    public static final String SUCCESS = "success";
    //对象已存在
    public static final String EXIST = "exist";
    //返回首页
    public static final String LOGIN = "login";
    
    //vm refund
    
    public static final String MACHINENUM="机器号：";
    //payment interface
    public static final String PAYMENT_INTERFACE_GET_BY_PAGE_ERROR="PI001";
    public static final String PAYMENT_INTERFACE_CREATE_ERROR="PI002";
    public static final String PAYMENT_INTERFACE_ENABLE_ERROR="PI003";
    public static final String PAYMENT_INTERFACE_DISABLE_ERROR="PI004";
    public static final String PAYMENT_INTERFACE_CHECK_DUP_ERROR="PI005";
    public static final String PAYMENT_INTERFACE_MODIFY_ERROR="PI006";
    
    public static final String PAYMENT_NOTIFY_URL="/bss/paymentAsynResponse.action";
    public static final String PAYMENT_RETURN_URL="/bss/paymentResponse.action";
    public static final String PAYMENT_REQUEST_URL="https://mapi.alipay.com/gateway.do?";
    
    public static final String ORDER_STATUS_PAID="已支付";
    public static final String ORDER_STATUS_CANCEL="已取消";
    
    public static final String ORDER_STATUS_WAITAPPROVE="待审核";
    public static final String ORDER_STATUS_APPROVED="已审核";
    public static final String ORDER_STATUS_REJECTED="已拒绝";
    
    //RabbitMQUtil
//    public static final String RABBITMQ_METHOD_NAME = "JobMethod";
//    public static final String RABBITMQ_PARAM = "Parameter";
//    public static final String RABBITMQ_RESOURCELOG = "HcEventResource";
//    public static final String RABBITMQ_OPSLOG = "HcEventVmOps";
//    public static final String JOB_TYPE_RESOURCE="Resource";
//    public static final String JOB_TYPE_OPS="OPS";
    
    public static final String DEFAULT_SECURITY_KEY="eefadd3f";
    
    //systemmanagement
    public static final String GET_BUSINESS_PLAT_BY_PAGE_ERROR="04003";
    public static final String GET_CONTROL_PANEL_BY_PAGE_ERROR="04004";
    //控制面板登录url，action部分
    public static final String CP_LOGIN_ACTION="/urlLogin!urlLogin.action?";
    //操作日志，返回操作结果常量
    public static final short RESULT_SUCESS=1;
    public static final short RESULT_FAILURE=2;
    
    public static final String T_ORDER_ARRANGING_ID = "hc_order_arranging_id";
    
    public static final String T_VM_ARRANGING_NAME = "hc_vm_arranging_Name";
    
    public static final String IMAGE_CONTAINER_TYPE="bare";
    public static final String IMAGE_VISIBILITY_PUBLIC="public";
    public static final String IMAGE_VISIBILITY_PRIVATE="private";
    
    public static final String NETWORK_DEFAULT_NAME="DEFAULT_NETWORK";
    public static final String DEFAULT_SUBNET_CIDR="192.168.10.0/24";
    public static final String DEFAULT_SUBNET_GATEWAY="192.168.10.1";
    public static final String DEFAULT_SUBNET_DNS="114.114.114.114,8.8.8.8";
    public static final String DEFAULT_SUBNET_NAME="DEFAULT_SUBNET";
    public static final Boolean DEFAULT_SUBNET_DNS_ENABLE=true;
    public static final int NETWORK_IP_VERSION=4;
    public static final Long DEFAULTUSERQUOTA=1l;
    

	public static final int IPRESOURCE_IS_NOT_ENOUGH = 1;
	public static final int CPURESOURCE_IS_NOT_ENOUGH = 2;
	public static final int MEMORYRESOURCE_IS_NOT_ENOUGH = 3;
	public static final int STORERESOURCE_IS_NOT_ENOUGH = 4;
	public static final String ALARM_IPRESOURCE_IS_NOT_ENOUGH = "IP资源不足，使用率已经超过";
	public static final String ALARM_CPURESOURCE_IS_NOT_ENOUGH = "虚拟CPU资源不足，使用率已经超过";
	public static final String ALARM_MEMORYRESOURCE_IS_NOT_ENOUGH = "虚拟内存资源不足，使用率已经超过";
	public static final String ALARM_STORERESOURCE_IS_NOT_ENOUGH = "存储资源不足，使用率已经超过";
	public static final String RESET_PASSWORD_ERROR="RESET_PASSWORD_ERROR";
	public static final Long DEFAULT_DOMAIN_ID=1L;
	public static final int SUBNET_MAX_VM_NUM=220;//子网最大vm数量
	
//	public static final String MSM_USERNAME="31sylf10HLGpYg0IDpE0+w==";
//	public static final String MSM_PASSWD="vHBIS3NUfLlnkAUVr/8IZw==";
//	public static final String MSM_API="http://api.smsbao.com/sms";
	
	
	public static final String MSM_USERNAME="phicloud";
	public static final String MSM_PASSWD="f04d123d21f14aadfa30275ae844c33e";
	public static final String MSM_API="http://api.smsbao.com/sms";
	public static final String MSM_COMPANY="【斐讯云】";
	
	public static final String MSM_STATUS_CREATED="CREATED";
	
	public static final String MSM_STATUS_SENDED="SENDED";
	
	public static final String VNC_PORT="vnc_port";
	public static final String RESOURCE_TYPE="global";
	
	public static final String NET_TYPE_VLAN="vlan";
	public static final String NET_TYPE_FLAT="flat";
	public static final String PHYSICAL_NETWORK="external";
	public static final String DELETE_VM_WHEN_IN_GROUP_TIP="DELETE_VM_WHEN_IN_GROUP_TIP";
	
	public static final short ORDER_TYPE_SC_BUY = 1;
	public static final short ORDER_TYPE_DEMAND_BUY = 2;
	public static final String RESET_PASSWOD_ERROR = "ResetPasswoedError";
	public static final String BINDING_DISK_ERROR = "BINDING_DISK_ERROR"; 
	public static final String SYNC_VOLUME_INFO_ERROR= "SYNC_VOLUME_INFO_ERROR";
	public static final String UPDATE_SNAPSHOT= "UPDATE_SNAPSHOT";
	public static final String BACKUP_VM_ERROR= "BACKUP_VM_ERROR";
	public static final String SYNCHRONOUS_VOLUME_SNAP= "SYNCHRONOUS_VOLUME_SNAP";
	public static final String RESET_OPERATING_SYSTEM_ERROR= "RESET_OPERATING_SYSTEM_ERROR";
	public static final String UPDATE_VM_RESOURAES_ERROR= "UPDATE_VM_RESOURAES_ERROR";
	public static final String UPDATE_DISK_ERROR= "UPDATE_DISK_ERROR";
	public static final String HANDLE_MESSAGE_FOR_IP_ERROR= "HANDLE_MESSAGE_FOR_IP_ERROR";
	public static final String GET_IP_AND_UPDATE_IPSTATUS_ERROR= "GET_IP_AND_UPDATE_IPSTATUS_ERROR";
	public static final String GET_ALL_BUSINESS_PLATFORM_BY_PAGE= "GET_ALL_BUSINESS_PLATFORM_BY_PAGE";
	public static final String GET_ALL_BUSINESS_PLAT_FORM_COUNT_ERROR= "GET_ALL_BUSINESS_PLAT_FORM_COUNT_ERROR";
	public static final String GET_HOST_BY_USER_ERROR= "GET_HOST_BY_USER_ERROR";
	public static final String CREATE_USER_ERROR= "CREATE_USER_ERROR";
	public static final String FIND_USER_BY_USERID_ERROR= "FIND_USER_BY_USERID_ERROR";
	public static final String DELETE_USER_BY_USERID_ERROR= "DELETE_USER_BY_USERID_ERROR";
	public static final String SUBMINT_REFUND_APPLY_ERROR= "SUBMINT_REFUND_APPLY_ERROR";
	public static final String VEFIY_ORDER_CAN_PAY_OR_NOT_ERROR= "VEFIY_ORDER_CAN_PAY_OR_NOT_ERROR";
	public static final String SUBMIT_ORDER_ERROR_SUBMIT= "SUBMIT_ORDER_ERROR";
	public static final String ADD_ITEM_ERROR= "ADD_ITEM_ERROR";
	public static final String ADD_ITEM_FOR_REST= "ADD_ITEM_FOR_REST";
	public static final String RENWE_ORDER_V2_ERROR= "RENWE_ORDER_V2_ERROR";
	public static final String TONORMA1V2_ERROR= "TONORMA1V2_ERROR";
	public static final String VM_TO_NORMAL_GEN_ORDER_ERROR= "VM_TO_NORMAL_GEN_ORDER_ERROR";
	public static final String GEN_AIPAY_PAY_REQUEST_ERROR= "GEN_AIPAY_PAY_REQUEST_ERROR";
	public static final String VERIFY_ALIPAY_RESPONSE_ERROR= "VERIFY_ALIPAY_RESPONSE_ERROR";
	public static final String GENERTA_VM_BEAN_BY_SC= "GENERTA_VM_BEAN_BY_SC";
	public static final String GET_VMSTATE_BY_ORDER_ITEMID_ERROR= "GET_VMSTATE_BY_ORDER_ITEMID_ERROR";
	public static final String SUBMIT_TRY_VM_ERROR_SUBMIT= "SUBMIT_TRY_VM_ERROR";
	public static final String VM_REFUND_FOR_APPLY_ERROR= "VM_REFUND_FOR_APPLY_ERROR";
	public static final String SUBMIT_ORDER4_NEED_ERROR= "SUBMIT_ORDER4_NEED_ERROR";
	public static final String CREATE_A_PUBLIC_NETWORK= "CREATE_A_PUBLIC_NETWORK";
	public static final String ADMIN_FREEZE= "ADMIN_FREEZE";
	public static final String CREATE_VM_SUCESS= "CREATE_VM_SUCESS";
	public static final String GET_ZONEIDS_BY_REGIONCODE_EEROR="GET_ZONEIDS_BY_REGIONCODE_EEROR";
	public static final String CREATE_SUBNET_BY_REST_ERROR="CREATE_SUBNET_BY_REST_ERROR";
	public static final String CREATE_SUBNET_ERROR="CREATE_SUBNET_ERROR";
	public static final String CREATE_SUBNET_OVERLAPS_ERROR="CREATE_SUBNET_OVERLAPS_ERROR";
	public static final String CREATE_SUBNET_GATEWAY_ERROR="CREATE_SUBNET_GATEWAY_ERROR";
	public static final String OS_THERE_ARE="OS_THERE_ARE";
	public static final String DOMAIN_NAME_ERROR="DOMAIN_NAME_ERROR";
	public static final String DOMAIN_CODE_ERROR="DOMAIN_CODE_ERROR";
	public static final String DOMAIN_ADDRESS_ERROR="DOMAIN_ADDRESS_ERROR";
	public static final String SUBNET_NAME_ERROR="SUBNET_NAME_ERROR";
	public static final String SUBNET_NAME_EXIST="SUBNET_NAME_EXIST";
	public static final String OS_HAS_BEEN_DELETE="OS_HAS_BEEN_DELETE";
	public static final String OS_HAS_BEEN_UNRELATED="OS_HAS_BEEN_UNRELATED";
	public static final String CPU_HAS_BEEN_DELETE="CPU_HAS_BEEN_DELETE";
	public static final String DISK_HAS_BEEN_DELETE="DISK_HAS_BEEN_DELETE";
	public static final String BAND_HAS_BEEN_DELETE="BAND_HAS_BEEN_DELETE";
	public static final String MEM_HAS_BEEN_DELETE="MEM_HAS_BEEN_DELETE";
	public static final String IMAGE_HAS_BEEN_DELETE="IMAGE_HAS_BEEN_DELETE";
	public static final String INVOKE_OPENSTACK_INTERFACE_ERROR="INVOKE_OPENSTACK_INTERFACE_ERROR";
	public static final String OS_HAS_BEEN_RELATED="OS_HAS_BEEN_RELATED";
	public static final String TAOCAN_HAS_BEEN_RELATED="TAOCAN_HAS_BEEN_RELATED";
	public static final String VM_HAS_BEEN_RELATED="VM_HAS_BEEN_RELATED";
}
