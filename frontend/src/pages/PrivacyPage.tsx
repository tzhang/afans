import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回注册
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-gray-600 mb-8">最后更新时间：2024年1月1日</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 隐私政策概述</h2>
            <p className="text-gray-700 mb-4">
              ago.im（以下简称"我们"或"本平台"）非常重视用户的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
            </p>
            <p className="text-gray-700 mb-4">
              使用我们的服务即表示您同意本隐私政策的条款。如果您不同意本政策，请不要使用我们的服务。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 信息收集</h2>
            <p className="text-gray-700 mb-4">我们可能收集以下类型的信息：</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2.1 您主动提供的信息</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>注册信息：用户名、邮箱地址、密码</li>
              <li>个人资料：头像、显示名称、个人简介、所在地、个人网站</li>
              <li>支付信息：银行卡信息、支付记录</li>
              <li>内容信息：您发布的内容、评论、互动记录</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2.2 自动收集的信息</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>设备信息：设备类型、操作系统、浏览器类型</li>
              <li>使用信息：访问时间、页面浏览记录、点击行为</li>
              <li>网络信息：IP地址、网络连接类型</li>
              <li>位置信息：基于IP地址的大致地理位置</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 信息使用</h2>
            <p className="text-gray-700 mb-4">我们使用收集的信息用于：</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>提供和维护我们的服务</li>
              <li>处理您的订阅和支付</li>
              <li>个性化内容推荐</li>
              <li>改进我们的服务质量</li>
              <li>发送重要通知和更新</li>
              <li>防止欺诈和滥用行为</li>
              <li>遵守法律法规要求</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 信息共享</h2>
            <p className="text-gray-700 mb-4">我们不会出售、交易或转让您的个人信息给第三方，除非：</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>获得您的明确同意</li>
              <li>为提供服务所必需（如支付处理）</li>
              <li>遵守法律法规或政府要求</li>
              <li>保护我们的权利和安全</li>
              <li>业务转让或合并情况下</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. 信息存储和安全</h2>
            <p className="text-gray-700 mb-4">
              我们采用行业标准的安全措施来保护您的个人信息：
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>数据加密：传输和存储过程中的数据加密</li>
              <li>访问控制：严格限制员工对个人信息的访问</li>
              <li>安全监控：24/7安全监控和威胁检测</li>
              <li>定期审计：定期进行安全审计和漏洞扫描</li>
            </ul>
            <p className="text-gray-700 mb-4">
              您的信息存储在安全的服务器上，我们会根据法律要求和业务需要保留您的信息。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Cookie和追踪技术</h2>
            <p className="text-gray-700 mb-4">
              我们使用Cookie和类似技术来改善用户体验：
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>必要Cookie：维持网站基本功能</li>
              <li>功能Cookie：记住您的偏好设置</li>
              <li>分析Cookie：了解网站使用情况</li>
              <li>广告Cookie：提供相关的内容推荐</li>
            </ul>
            <p className="text-gray-700 mb-4">
              您可以通过浏览器设置管理Cookie偏好。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. 您的权利</h2>
            <p className="text-gray-700 mb-4">您对自己的个人信息享有以下权利：</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>访问权：查看我们持有的您的个人信息</li>
              <li>更正权：更正不准确或不完整的信息</li>
              <li>删除权：要求删除您的个人信息</li>
              <li>限制权：限制我们处理您的信息</li>
              <li>可携权：获取您的数据副本</li>
              <li>反对权：反对我们处理您的信息</li>
            </ul>
            <p className="text-gray-700 mb-4">
              如需行使这些权利，请通过本政策末尾的联系方式与我们联系。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. 未成年人保护</h2>
            <p className="text-gray-700 mb-4">
              我们的服务面向18岁以上的成年人。我们不会故意收集未满18岁未成年人的个人信息。如果我们发现收集了未成年人的信息，会立即删除。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. 国际数据传输</h2>
            <p className="text-gray-700 mb-4">
              您的信息可能会被传输到您所在国家/地区以外的地方进行处理。我们会确保这些传输符合适用的数据保护法律。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. 政策更新</h2>
            <p className="text-gray-700 mb-4">
              我们可能会不时更新本隐私政策。重大变更会通过网站通知或邮件方式告知您。继续使用我们的服务即表示您接受更新后的政策。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. 数据泄露通知</h2>
            <p className="text-gray-700 mb-4">
              如果发生可能影响您个人信息安全的数据泄露事件，我们会在发现后72小时内通知相关监管机构，并及时通知受影响的用户。
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">联系我们</h3>
              <p className="text-gray-700 mb-4">
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <ul className="text-gray-700">
                <li>邮箱：privacy@ago.im</li>
                <li>客服热线：400-123-4567</li>
                <li>地址：北京市朝阳区xxx路xxx号</li>
                <li>数据保护官：dpo@ago.im</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;