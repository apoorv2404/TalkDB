// import DatabaseExplorer from '@/components/DatabaseExplorer';

// export default function Home() {
//   return (
//     <main>
//       <DatabaseExplorer />
//     </main>
//   );
// }

// src/app/page.tsx
'use client';

import React from 'react';
import { Layout } from 'antd';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';

const { Content } = Layout;

export default function Home() {
  return (
    <Content>
      <Hero />
      <Features />
    </Content>
  );
}