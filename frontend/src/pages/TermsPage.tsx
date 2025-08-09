import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-gray-600 mb-8">最后更新时间：2024年1月1日</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 服务简介</h2>
            <p className="text-gray-700 mb-4">
              欢迎使用 ago.im（以下简称"本平台"）。本平台是一个订阅制内容变现平台，为创作者和用户提供优质的内容订阅服务。
            </p>
            <p className="text-gray-700 mb-4">
              通过注册和使用本平台，您同意遵守本服务条款的所有规定。如果您不同意本条款的任何部分，请不要使用本平台。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 账户注册</h2>
            <p className="text-gray-700 mb-4">
              您需要提供真实、准确、完整的注册信息，并及时更新这些信息以保持其准确性。您有责任保护您的账户密码安全。
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>您必须年满18周岁才能注册账户</li>
              <li>每个用户只能注册一个账户</li>
              <li>禁止使用虚假信息注册账户</li>
              <li>禁止将账户转让给他人使用</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 用户行为规范</h2>
            <p className="text-gray-700 mb-4">在使用本平台时，您同意不会：</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>发布违法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容</li>
              <li>侵犯他人的知识产权、隐私权或其他合法权益</li>
              <li>传播病毒、恶意软件或其他有害代码</li>
              <li>进行任何可能损害平台正常运行的行为</li>
              <li>使用自动化工具或机器人访问平台</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 内容政策</h2>
            <p className="text-gray-700 mb-4">
              创作者发布的内容必须符合法律法规和平台规定。平台有权审核、编辑或删除不符合要求的内容。
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>内容必须是原创或已获得合法授权</li>
              <li>禁止发布涉及政治敏感、暴力、色情等内容</li>
              <li>禁止发布虚假信息或误导性内容</li>
              <li>禁止发布侵犯他人权益的内容</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. 订阅和付费</h2>
            <p className="text-gray-700 mb-4">
              用户可以订阅创作者的内容，订阅费用将根据创作者设定的价格收取。
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>订阅费用按月收取，自动续费</li>
              <li>用户可以随时取消订阅</li>
              <li>已支付的费用不予退还</li>
              <li>平台会从订阅费用中收取一定比例的服务费</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. 知识产权</h2>
            <p className="text-gray-700 mb-4">
              平台尊重知识产权，创作者对其发布的原创内容享有著作权。用户订阅内容仅供个人使用，不得转载、分享或商业使用。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. 免责声明</h2>
            <p className="text-gray-700 mb-4">
              平台仅提供信息发布和交流的平台服务，不对用户发布的内容承担责任。平台不保证服务的连续性和稳定性。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. 服务变更和终止</h2>
            <p className="text-gray-700 mb-4">
              平台有权随时修改或终止服务，并会提前通知用户。用户也可以随时停止使用服务并注销账户。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. 争议解决</h2>
            <p className="text-gray-700 mb-4">
              因使用本平台产生的争议，双方应友好协商解决。协商不成的，提交至平台所在地人民法院诉讼解决。
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. 条款修改</h2>
            <p className="text-gray-700 mb-4">
              平台有权随时修改本服务条款，修改后的条款将在平台上公布。继续使用服务即表示您同意修改后的条款。
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">联系我们</h3>
              <p className="text-gray-700">
                如果您对本服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <ul className="mt-2 text-gray-700">
                <li>邮箱：legal@ago.im</li>
                <li>客服热线：400-123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;