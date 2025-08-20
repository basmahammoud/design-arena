// SaveButton.jsx
import { useSaveDesign } from '../../../../hooks/usesavedesign';
import { FaSave } from 'react-icons/fa';

const SaveButton = ({ elements, canvasSize, stageRef, designId }) => {
  const { saveDesign, isSaving } = useSaveDesign();

  const handleSave = async () => {
    try {
      const imageBase64 = stageRef?.current?.getStage().toDataURL();

      if (!imageBase64) {
        console.error("📛 imageBase64 undefined: stageRef not attached properly");
        alert("❌ تعذر الحصول على صورة التصميم. تأكد من أن العنصر جاهز.");
        return;
      }

      console.log('🎨 Image Base64:', imageBase64);
       console.log('📌 designId in SaveButton:', designId);

    await saveDesign({
     elements,
     imageBase64,
     name: 'new design',
     designId,
     canvasSize, // ✅ خزن أبعاد الكانفاس
     type: canvasSize.width === 390 ? "mobile" : "web" // أو خزن النوع مباشرة
    });

      alert('✅ تم حفظ التصميم بنجاح');
    } catch (error) {
      alert('❌ فشل في الحفظ');
    }
  };

  return (
    <button
      className="save-btn"
      onClick={handleSave}
      disabled={isSaving}
      title="حفظ التصميم"
    >
      <FaSave />
    </button>
  );
};

export default SaveButton;
