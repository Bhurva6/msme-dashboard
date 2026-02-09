# Multi-Language Support

The MSME Funding Platform now supports **English**, **Hindi**, and **Marathi** languages!

## Features

### 🌐 Language Selection During Signup
- Users can select their preferred language right at the beginning of the signup process
- Available languages:
  - **English** (en)
  - **हिंदी Hindi** (hi)
  - **मराठी Marathi** (mr)

### ⏳ Smooth Language Transition
- When a user changes the language, a beautiful loading screen appears
- The entire app interface is translated after 1.5 seconds
- Globe animation with spinner provides visual feedback

### 💾 Language Persistence
- Selected language is stored in `localStorage`
- User's language preference is remembered across sessions
- No need to select language again on subsequent visits

## Implementation Details

### Context API
- `LanguageContext` provides language functionality throughout the app
- `useLanguage()` hook gives access to:
  - `language`: Current language code
  - `setLanguage()`: Function to change language
  - `t()`: Translation function
  - `isChangingLanguage`: Loading state

### Components
1. **LanguageSelector**: Dropdown component for language selection
   - Shows current language with native name
   - Dropdown with all available languages
   - Check mark on selected language

2. **LanguageLoader**: Full-screen loading animation
   - Globe icon with pulse animation
   - Spinning border effect
   - Loading message

### Translations
All translations are stored in `/src/contexts/LanguageContext.tsx` including:
- Common terms (Continue, Back, Next, etc.)
- Signup and OTP verification screens
- Onboarding flow (welcome, questions, schemes)
- Questions and options
- Scheme information

## Translated Pages

✅ **SignupPage**: Title, subtitle, form labels, and buttons  
✅ **OnboardingPage**: Welcome message, options, descriptions  
✅ **OnboardingQuestionsPage**: Questions, options, navigation  
🔜 **SchemesPage**: Scheme titles, descriptions, benefits (coming soon)  
🔜 **Other pages**: Dashboard, Profile, etc. (to be added)

## Usage Example

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('signup.title')}</h1>
      <button onClick={() => setLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  );
}
```

## Adding New Translations

To add new translations, update the `translations` object in `LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    'my.key': 'English text',
  },
  hi: {
    'my.key': 'हिंदी पाठ',
  },
  mr: {
    'my.key': 'मराठी मजकूर',
  },
};
```

Then use it in your component:
```tsx
{t('my.key')}
```

## Future Enhancements

- [ ] Add more languages (Tamil, Telugu, Bengali, etc.)
- [ ] Complete translation for all remaining pages
- [ ] Add RTL support for relevant languages
- [ ] Currency and date localization
- [ ] Voice-over support for accessibility
