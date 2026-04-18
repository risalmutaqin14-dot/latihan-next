'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Smartphone,
  Tablet,
  Laptop,
  ShieldCheck,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { devicesSupported } from '@/data';

interface DeviceCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  operatingSystem: string;
  isComingSoon: boolean;
  supportedLabel: string;
  comingSoonLabel: string;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  title,
  desc,
  icon: Icon,
  imageSrc,
  imageAlt,
  imageCaption,
  operatingSystem,
  isComingSoon,
  supportedLabel,
  comingSoonLabel,
}) => (
  <article
    itemScope
    itemType="https://schema.org/SoftwareApplication"
    className={`relative group p-8 rounded-3xl border border-3 transition-all duration-500 ${
    isComingSoon
      ? 'bg-gray-50 border-gray-200'
      : 'bg-white border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2'
  }`}
  >
    <meta itemProp="applicationCategory" content="EducationalApplication" />
    <meta itemProp="operatingSystem" content={operatingSystem} />
    <meta itemProp="image" content={imageSrc} />

    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${isComingSoon ? 'bg-gray-200 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
        <Icon size={28} />
      </div>
      {isComingSoon ? (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <Clock size={12} /> {comingSoonLabel}
        </span>
      ) : (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={12} /> {supportedLabel}
        </span>
      )}
    </div>

    <h3 itemProp="name" className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p itemProp="description" className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>

    <figure className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          title={title}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </figure>
  </article>
);

type PlatformDefinition = {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAltKey: string;
  imageCaptionKey: string;
  operatingSystem: string;
  isComingSoon: boolean;
};

export default function DeviceSupport() {
  const { t } = useTranslation();

  const platformDefinitions: PlatformDefinition[] = [
    {
      titleKey: 'deviceSupport.platforms.web.title',
      descKey: 'deviceSupport.platforms.web.desc',
      icon: Globe,
      imageSrc: devicesSupported.webapp,
      imageAltKey: 'deviceSupport.platforms.web.imageAlt',
      imageCaptionKey: 'deviceSupport.platforms.web.imageCaption',
      operatingSystem: 'Web Browser',
      isComingSoon: false,
    },
    {
      titleKey: 'deviceSupport.platforms.ios.title',
      descKey: 'deviceSupport.platforms.ios.desc',
      icon: Tablet,
      imageSrc: devicesSupported.ios,
      imageAltKey: 'deviceSupport.platforms.ios.imageAlt',
      imageCaptionKey: 'deviceSupport.platforms.ios.imageCaption',
      operatingSystem: 'iOS, iPadOS',
      isComingSoon: false,
    },
    {
      titleKey: 'deviceSupport.platforms.android.title',
      descKey: 'deviceSupport.platforms.android.desc',
      icon: Smartphone,
      imageSrc: devicesSupported.android,
      imageAltKey: 'deviceSupport.platforms.android.imageAlt',
      imageCaptionKey: 'deviceSupport.platforms.android.imageCaption',
      operatingSystem: 'Android',
      isComingSoon: false,
    },
    {
      titleKey: 'deviceSupport.platforms.desktop.title',
      descKey: 'deviceSupport.platforms.desktop.desc',
      icon: Laptop,
      imageSrc: devicesSupported.MacWindows,
      imageAltKey: 'deviceSupport.platforms.desktop.imageAlt',
      imageCaptionKey: 'deviceSupport.platforms.desktop.imageCaption',
      operatingSystem: 'macOS, Windows',
      isComingSoon: true,
    },
  ];

  const supportedLabel = t('deviceSupport.badges.supported');
  const comingSoonLabel = t('deviceSupport.badges.comingSoon');
  const platforms = platformDefinitions.map((platform) => ({
    ...platform,
    title: t(platform.titleKey),
    desc: t(platform.descKey),
    imageAlt: t(platform.imageAltKey),
    imageCaption: t(platform.imageCaptionKey),
    supportedLabel,
    comingSoonLabel,
  }));

  return (
    <section id="device-support" className="pt-30 bg-white" aria-labelledby="device-support-title">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#324E74] font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-2 rounded-full mb-4 inline-block">
            {t('deviceSupport.tag')}
          </span>
          <h2 id="device-support-title" className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('deviceSupport.title')}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {t('deviceSupport.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <DeviceCard key={platform.titleKey} {...platform} />
          ))}
        </div>
      </div>
    </section>
  );
}
