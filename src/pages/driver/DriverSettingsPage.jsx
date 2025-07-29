import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sun, Moon, Monitor, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsCard = ({ title, description, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const DriverSettingsPage = () => {
  const { user } = useAuth();
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    navigation_app: 'google_maps',
    sound_volume: 0.8,
    iban: '',
    swift: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('driver_settings')
      .select('*')
      .eq('driver_id', user.id)
      .single();

    if (data) {
      setSettings({
        navigation_app: data.navigation_app || 'google_maps',
        sound_volume: data.sound_volume || 0.8,
        iban: data.iban || '',
        swift: data.swift || '',
      });
      setTheme(data.theme || 'system');
    } else if (error && error.code !== 'PGRST116') { // Ignore "no rows found"
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    }
    setIsLoading(false);
  }, [user, toast, setTheme]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    handleSave({ theme: value });
  };

  const handleSave = async (specificUpdate) => {
    if (!user) return;
    setIsSaving(true);

    const updates = specificUpdate || {
      navigation_app: settings.navigation_app,
      sound_volume: settings.sound_volume,
      iban: settings.iban,
      swift: settings.swift,
    };

    const { error } = await supabase
      .from('driver_settings')
      .upsert({ driver_id: user.id, ...updates }, { onConflict: 'driver_id' });

    if (error) {
      toast({ title: t('driver.settings.saveError'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('driver.settings.saveSuccess'), variant: 'success' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('driver.settings.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <SettingsCard title={t('driver.settings.themeTitle')} description={t('driver.settings.themeSubtitle')}>
            <Tabs value={theme} onValueChange={handleThemeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="light"><Sun className="mr-2 h-4 w-4" />{t('driver.settings.themeOptions.light')}</TabsTrigger>
                <TabsTrigger value="dark"><Moon className="mr-2 h-4 w-4" />{t('driver.settings.themeOptions.dark')}</TabsTrigger>
                <TabsTrigger value="system"><Monitor className="mr-2 h-4 w-4" />{t('driver.settings.themeOptions.system')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </SettingsCard>

          <SettingsCard title={t('driver.settings.navigationTitle')} description={t('driver.settings.navigationSubtitle')}>
            <Select value={settings.navigation_app} onValueChange={(value) => handleSettingsChange('navigation_app', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google_maps">{t('driver.settings.navOptions.google_maps')}</SelectItem>
                <SelectItem value="waze">{t('driver.settings.navOptions.waze')}</SelectItem>
                <SelectItem value="apple_maps">{t('driver.settings.navOptions.apple_maps')}</SelectItem>
              </SelectContent>
            </Select>
          </SettingsCard>

          <SettingsCard title={t('driver.settings.soundTitle')} description={t('driver.settings.soundSubtitle')}>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.sound_volume]}
                onValueChange={(value) => handleSettingsChange('sound_volume', value[0])}
                max={1}
                step={0.1}
              />
              <span className="text-sm font-medium text-muted-foreground w-16 text-center">
                {Math.round(settings.sound_volume * 100)}%
              </span>
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-8">
          <SettingsCard title={t('driver.settings.paymentTitle')} description={t('driver.settings.paymentSubtitle')}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="iban">{t('driver.settings.ibanLabel')}</Label>
                <Input id="iban" value={settings.iban} onChange={(e) => handleSettingsChange('iban', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="swift">{t('driver.settings.swiftLabel')}</Label>
                <Input id="swift" value={settings.swift} onChange={(e) => handleSettingsChange('swift', e.target.value)} />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('driver.settings.aboutTitle')} description={t('driver.settings.aboutSubtitle')}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('driver.settings.version')}:</span>
                <span>Veeo 0.145.10001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('driver.settings.creator')}:</span>
                <span>AMSN-LM</span>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => handleSave()} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {t('common.save')}
        </Button>
      </div>
    </motion.div>
  );
};

export default DriverSettingsPage;