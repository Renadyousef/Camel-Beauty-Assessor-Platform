import Button from "../Button/Button";
import { ChevronLeftIcon, InfoIcon, ScanIcon, TrophyIcon, UploadIcon } from "../../icons";
import { TEAM_SIZE } from "../../config";
import styles from "./Landing.module.css";

/**
 * Entry screen. It exists to answer "what is this and why" before the judge
 * is asked to do anything, so it carries no step indicator and no inputs —
 * one action leads into Setup.
 *
 * The hero sits on the page's own decorative backdrop rather than a panel of
 * its own. Its artwork is a caravan: the same camel crossing the strip
 * left to right, rising slightly as it goes, four times over at staggered
 * delays so at least one is always in view. It is decoration only — with
 * motion disabled (the global prefers-reduced-motion rule in index.css) the
 * camels simply sit still and the screen works exactly the same.
 */
export default function Landing({ onStart }) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true">
          <img className={`${styles.camel} ${styles.camel1}`} src="/camel-walk.png" alt="" />
          <img className={`${styles.camel} ${styles.camel2}`} src="/camel-walk.png" alt="" />
          <img className={`${styles.camel} ${styles.camel3}`} src="/camel-walk.png" alt="" />
          <img className={`${styles.camel} ${styles.camel4}`} src="/camel-walk.png" alt="" />
        </div>

        <div className={styles.heroText}>
          <div className={styles.eyebrow}>أداة تحكيم مساندة</div>
          <h1 className={styles.title}>تحكيم المزاين بعين الذكاء الاصطناعي</h1>
          <p className={styles.lede}>
            أداة صُمّمت لمساندة لجان تحكيم المزاين في قياس صفات الإبل وترتيب المنقيات. بعد أربعين ناقة، تبدأ الصفات
            تتشابه على العين وتصعب المقارنة. الأداة تشوف كل ناقة بنفس الدقة، من الأولى للأخيرة. تقيس ثمان صفات في كل
            وحدة، وتجمّعها في تقرير يقول لك طابع المنقية، وأفضل نوقها، والصفة اللي حسمت الفرق. وفوق هذا كله، تعلن لك
            المنقية الفائزة بدرجتها.
          </p>

          <p className={styles.ledeStrong}>
            عين ما تتعب. أنت تقرأ التقرير في دقيقة، والحكم يبقى لك.
          </p>
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerDiamond} />
        <span className={styles.dividerLine} />
      </div>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>قارن منقيتين في دقائق</h2>
        <p className={styles.ctaText}>ارفع صور المنقيتين، وخلّ التحليل يعطيك تقريراً واضحاً لكل منقية على حدة.</p>

        <Button size="lg" onClick={onStart}>
          ابدأ المقارنة
          <ChevronLeftIcon size={18} />
        </Button>

        <div className={styles.ctaHint}>تحتاج {TEAM_SIZE} صورة لكل منقية</div>
      </section>

      <section className={styles.steps} aria-label="كيف تعمل الأداة">
        <Highlight icon={<UploadIcon size={20} />} title="ارفع الصور">
          صورة واضحة لكل ناقة، دفعة واحدة أو صورة صورة
        </Highlight>
        <Highlight icon={<ScanIcon size={20} />} title="ثماني صفات">
          الغارب والرأس والمشافر والخشم والسنام والسيقان والرقبة والجنب
        </Highlight>
        <Highlight icon={<TrophyIcon size={20} />} title="تقرير لكل منقية">
          طابع المنقية وأفضل نوقها والفارق الذي حسم النتيجة
        </Highlight>
      </section>

      <div className={styles.disclaimer}>
        <InfoIcon size={16} />
        <span>
          هذه النتيجة مدعومة بالذكاء الاصطناعي وتقدم كأداة مساندة للجنة التحكيم، ولا تغني عن التقييم الرسمي للجنة.
        </span>
      </div>
    </div>
  );
}

function Highlight({ icon, title, children }) {
  return (
    <div className={styles.highlight}>
      <span className={styles.highlightIcon}>{icon}</span>
      <div className={styles.highlightTitle}>{title}</div>
      <p className={styles.highlightText}>{children}</p>
    </div>
  );
}