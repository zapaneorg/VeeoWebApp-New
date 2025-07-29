import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const Footer = () => {
  const { t } = useLocale();

  const footerSections = [
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), path: '/about' },
        { label: t('footer.services'), path: '/services' },
        { label: t('footer.blog', {defaultValue: 'Blog'}), path: '/blog' },
      ],
    },
    {
      title: t('footer.drivers'),
      links: [
        { label: t('footer.becomeADriver', {defaultValue: 'Devenir chauffeur'}), path: '/drivers' },
        { label: t('footer.driverResources', {defaultValue: 'Ressources chauffeurs'}), path: '/driver-resources' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.helpCenter'), path: '/help' },
        { label: t('footer.contactUs'), path: '/contact' },
        { label: t('footer.terms'), path: '/terms' },
        { label: t('footer.privacy'), path: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, path: 'https://facebook.com/veeo', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, path: 'https://twitter.com/veeo', label: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, path: 'https://instagram.com/veeo', label: 'Instagram' },
    { icon: <Linkedin className="h-5 w-5" />, path: 'https://linkedin.com/company/veeo', label: 'LinkedIn' },
  ];

  const logoFontClass = "font-['Poppins_Bold',_sans-serif] font-black tracking-tighter";

  return (
    <footer className="bg-brand-dark-gray text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="mb-8 lg:mb-0">
             <Link to="/" className={`text-3xl text-white flex items-center mb-4 ${logoFontClass}`}>
                Veeo<span className="inline-block ml-1 text-sky-400 text-4xl relative -top-1">.</span>
            </Link>
            <p className="text-sm text-gray-400 pr-4">
              {t('footer.slogan')}
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-lg font-semibold text-white mb-4">{section.title}</p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="hover:text-white transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {t('footer.companyName')}. {t('footer.rightsReserved')}
          </p>
          <div className="flex space-x-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.path}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;