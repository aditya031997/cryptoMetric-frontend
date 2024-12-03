<template>
    <div
    class="cm-card mt-4">
    <div class="disclaimer">
      <h1 class="title">CryptoMetric.com Software Disclaimer</h1>
      <div class="section" v-for="(section, index) in sections" :key="index">
        <h2 class="section-title">{{ index + 1 }}. {{ section.title }}</h2>
        <p v-for="(paragraph, idx) in section.content" :key="idx" class="section-content">
          {{ paragraph }}
        </p>
      </div>
      <footer class="contact">
        <h2>Contact Information</h2>
        <p>If you have questions or concerns, please contact us at:</p>
        <a href="mailto:support@keystoneinvestors.com">support@keystoneinvestors.com</a>
      </footer>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sections: [
          {
            title: "General Disclaimer",
            content: [
              'CryptoMetric.com ("the Platform") provides analytical tools and customizable data aggregation services for cryptocurrency users, utilizing third-party APIs such as Crypto News API, CoinMarketCap API, and others.',
              'While we strive to provide accurate and reliable data, all information on the Platform is provided "as is" and for informational purposes only.',
              'CryptoMetric.com makes no guarantees regarding the accuracy, completeness, or timeliness of any information displayed.',
            ],
          },
          {
            title: "Swap Feature Disclaimer",
            content: [
              'The Platform offers a swap feature that connects users to decentralized exchange (DEX) APIs, including but not limited to 1INCH and Uniswap.',
              'CryptoMetric.com is not a financial institution, broker, or intermediary and does not process transactions or hold user funds.',
              'The Platform serves solely as a technological interface to DEX APIs, and all transactions are executed directly between the user and the DEX.',
            ],
          },
          {
            title: "SEC Disclaimer",
            content: [
              'CryptoMetric.com does not sell, promote, or facilitate the sale of securities in any form.',
              'The Platform does not provide investment advice, recommendations, or endorsements for the purchase, sale, or holding of any securities, cryptocurrencies, or other financial instruments.',
              'All information and tools provided are for informational and analytical purposes only. Users are responsible for conducting their own due diligence and consulting with qualified professionals regarding investment decisions.',
            ],
          },
          {
            title: "No Warranties or Liability for Losses",
            content: [
              'CryptoMetric.com does not guarantee the security, reliability, or performance of third-party APIs or services connected through the Platform.',
              'By using the swap feature or any other functionality provided by CryptoMetric.com, you acknowledge and agree that:',
              'CryptoMetric.com is not responsible for any financial losses, damages, or other liabilities resulting from the use of the Platform or any connected third-party services.',
              'All transactions conducted through the swap feature are at your own risk.',
              'CryptoMetric.com does not verify or endorse the integrity, legality, or reliability of the services provided by third-party APIs.',
            ],
          },
          {
            title: "No Financial Advice",
            content: [
              'The content and tools provided by CryptoMetric.com are for informational and analytical purposes only and should not be considered financial, legal, or investment advice.',
              'CryptoMetric.com does not make recommendations or endorsements regarding any securities, cryptocurrencies, or investment strategies.',
            ],
          },
          {
            title: "No Sale of Information or Commission-Based Revenue",
            content: [
              'CryptoMetric.com is committed to protecting user privacy and does not sell, share, or otherwise distribute any user data to third parties.',
              'Additionally, CryptoMetric.com does not earn commissions or revenue from any data aggregation, analytical services, or transactions conducted through the swap feature or third-party APIs.',
              'All services are provided transparently and without hidden fees.',
            ],
          },
          {
            title: "Indemnification",
            content: [
              'By using CryptoMetric.com, you agree to indemnify, defend, and hold harmless the Platform and its affiliates, employees, and agents from any claims, damages, or expenses (including reasonable attorney\'s fees) arising from your use of the Platform or any connected third-party services.',
            ],
          },
          {
            title: "Limitation of Liability",
            content: [
              'To the fullest extent permitted by law, CryptoMetric.com shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Platform, including but not limited to losses resulting from system failures, unauthorized access, or errors in third-party APIs.',
            ],
          },
          {
            title: "Governing Law",
            content: [
              'This disclaimer and any disputes arising out of or related to the use of CryptoMetric.com shall be governed by the laws of the Cayman Islands.',
            ],
          },
          {
            title: "Amendments",
            content: [
              'CryptoMetric.com reserves the right to amend or update this disclaimer at any time without prior notice.',
              'Continued use of the Platform constitutes acceptance of the updated terms.',
            ],
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>

  .title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 40px;
    margin-top: 20px;
  }
  
  .last-updated {
    text-align: center;
    font-size: 0.9rem;
    color: #555;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
  }
  
  .section-content {
    margin-top: 5px;
    font-size: 15px;
    line-height: 21px;
    color: #7e8993;
  }
  
  .contact {
    text-align: center;
    margin-top: 30px;
    font-size: 0.9rem;
  }
  .contact h2{
    font-size: 22px;
    font-weight: 600;
  }
  .contact p{
    margin-bottom: 10px;
  }
  a{
    color: #01b7ff;
  }
  </style>
  