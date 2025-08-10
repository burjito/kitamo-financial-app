# Email Subject Line Recommendations for KitaMo OTP

## 🎯 **Recommended Subject Lines** (Choose One)

### **Option 1: Direct & Clear** ⭐ **BEST CHOICE**
```
Your KitaMo verification code: [6-digit code]
```

### **Option 2: Action-Oriented**
```
Complete your KitaMo signup in 2 minutes
```

### **Option 3: Urgency + Value**
```
[Action Required] Your KitaMo account is 90% ready
```

### **Option 4: Personalized**
```
Welcome to KitaMo! Verify your email to get started
```

### **Option 5: Benefit-Focused**
```
Your financial journey awaits - verify now
```

---

## 📋 **Subject Line Best Practices**

### **Why Option 1 is Recommended:**
- ✅ **Clear purpose** - Users know exactly what to expect
- ✅ **Includes actual code** - Easy to reference without opening
- ✅ **Professional** - Builds trust and credibility  
- ✅ **Spam-friendly** - Won't trigger spam filters
- ✅ **Mobile-optimized** - Shows clearly on mobile devices

### **Alternative Approaches:**

#### **🚀 For High Engagement:**
```
🔐 Your KitaMo code: [6-digit code] (expires in 5 min)
```

#### **📱 For Mobile Users:**
```
KitaMo Code: [6-digit code]
```

#### **💼 For Professional Tone:**
```
KitaMo Account Verification - Code: [6-digit code]
```

---

## 🎨 **Enhanced Subject with Supabase Variables**

Since Supabase supports template variables, you can use:

```
Your KitaMo verification code: {{ .Token }}
```

This will automatically insert the actual 6-digit code in the subject line, making it super convenient for users to reference without even opening the email.

---

## 📊 **Subject Line Testing Tips**

1. **Keep it under 50 characters** for mobile optimization
2. **Avoid spam trigger words** like "FREE", "URGENT", "ACT NOW"
3. **Include your brand name** for recognition
4. **Test with actual codes** to ensure formatting works
5. **Consider your audience** - financial users prefer professional tone

---

## ⚡ **Quick Implementation**

In your Supabase Dashboard:
1. Go to **Authentication → Email Templates**
2. Find **"Confirm signup"** template  
3. Set **Subject** to: `Your KitaMo verification code: {{ .Token }}`
4. Paste the enhanced HTML template in the body
5. **Save** and test!

This gives users the code right in their inbox list without opening the email - super convenient! 📧✨
