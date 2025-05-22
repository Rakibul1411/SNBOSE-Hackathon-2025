import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export default function Footer() {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              <span className="text-primary">Biplobi</span>-Biggan-Sikhkha
            </h3>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="flex space-x-4 pt-2">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/visualearn" className="text-sm text-muted-foreground hover:text-primary">
                  {t("visualearn")}
                </Link>
              </li>
              <li>
                <Link href="/ideaverse" className="text-sm text-muted-foreground hover:text-primary">
                  {t("ideaverse")}
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.subjects")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.about")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("footer.resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.blog")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.help")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Biplobi-Biggan-Sikhkha. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
