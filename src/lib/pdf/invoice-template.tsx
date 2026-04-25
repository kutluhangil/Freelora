import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice, InvoiceItem, Client, Profile } from "@/types/database";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa3JL7.woff2", fontWeight: 700 },
  ],
});

const ACCENT = "#0A0A0B";
const MUTED = "#6B6B70";
const BORDER = "#E5E5E7";
const FG = "#0A0A0B";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Inter",
    fontSize: 10,
    color: FG,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  brand: { fontSize: 22, fontWeight: 700, letterSpacing: -0.5 },
  invoiceTitle: {
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: -1,
    textAlign: "right",
  },
  invoiceMeta: { textAlign: "right", marginTop: 4, color: MUTED, fontSize: 10 },
  section: { marginBottom: 24 },
  twoCol: { flexDirection: "row", justifyContent: "space-between", gap: 32 },
  col: { flex: 1 },
  label: { fontSize: 8, color: MUTED, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  block: {
    backgroundColor: "#FAFAFA",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: 12,
  },
  fromName: { fontSize: 11, fontWeight: 600 },
  fromLine: { color: MUTED, marginTop: 2, fontSize: 9 },
  table: { marginTop: 8, borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F7",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${BORDER}`,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${BORDER}`,
  },
  cellHeader: { fontSize: 8, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 },
  cellDescription: { flex: 4, fontSize: 10 },
  cellQty: { flex: 1, textAlign: "right", fontSize: 10 },
  cellPrice: { flex: 1.5, textAlign: "right", fontSize: 10 },
  cellTotal: { flex: 1.5, textAlign: "right", fontSize: 10, fontWeight: 600 },
  totalsBox: { marginTop: 16, alignSelf: "flex-end", width: 240 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalsLabel: { color: MUTED, fontSize: 10 },
  totalsValue: { fontSize: 10, fontWeight: 600 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: ACCENT,
    color: "#FFFFFF",
    borderRadius: 6,
  },
  grandLabel: { fontSize: 10, color: "#FFFFFF" },
  grandValue: { fontSize: 14, fontWeight: 700, color: "#FFFFFF" },
  notes: { marginTop: 24, paddingTop: 12, borderTop: `1px solid ${BORDER}`, color: MUTED, fontSize: 9 },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: "center",
    color: MUTED,
    fontSize: 8,
  },
});

interface Props {
  invoice: Invoice;
  items: InvoiceItem[];
  client: Client | null;
  profile: Profile | null;
  labels: {
    invoiceTitle: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    billTo: string;
    from: string;
    description: string;
    qty: string;
    price: string;
    total: string;
    subtotal: string;
    tax: string;
    discount: string;
    grandTotal: string;
    paymentTerms: string;
    notes: string;
  };
  fmt: (n: number) => string;
}

export function InvoicePDFTemplate({ invoice, items, client, profile, labels, fmt }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Freelora</Text>
            {profile?.company_name && (
              <Text style={[styles.fromLine, { marginTop: 4 }]}>{profile.company_name}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>{labels.invoiceTitle}</Text>
            <Text style={styles.invoiceMeta}>
              #{invoice.invoice_number}
            </Text>
          </View>
        </View>

        {/* Info row */}
        <View style={[styles.twoCol, styles.section]}>
          <View style={styles.col}>
            <Text style={styles.label}>{labels.from}</Text>
            <View style={styles.block}>
              <Text style={styles.fromName}>{profile?.full_name ?? profile?.email ?? "—"}</Text>
              {profile?.company_name && <Text style={styles.fromLine}>{profile.company_name}</Text>}
              {profile?.address && <Text style={styles.fromLine}>{profile.address}</Text>}
              {(profile?.city || profile?.country) && (
                <Text style={styles.fromLine}>
                  {profile?.city ? `${profile.city}, ` : ""}{profile?.country ?? ""}
                </Text>
              )}
              {profile?.tax_id && <Text style={styles.fromLine}>TAX ID: {profile.tax_id}</Text>}
              {profile?.email && <Text style={styles.fromLine}>{profile.email}</Text>}
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>{labels.billTo}</Text>
            <View style={styles.block}>
              <Text style={styles.fromName}>{client?.name ?? "—"}</Text>
              {client?.company && <Text style={styles.fromLine}>{client.company}</Text>}
              {client?.address && <Text style={styles.fromLine}>{client.address}</Text>}
              {(client?.city || client?.country) && (
                <Text style={styles.fromLine}>
                  {client?.city ? `${client.city}, ` : ""}{client?.country ?? ""}
                </Text>
              )}
              {client?.tax_id && <Text style={styles.fromLine}>TAX ID: {client.tax_id}</Text>}
              {client?.email && <Text style={styles.fromLine}>{client.email}</Text>}
            </View>
          </View>
        </View>

        {/* Dates */}
        <View style={[styles.twoCol, styles.section]}>
          <View style={styles.col}>
            <Text style={styles.label}>{labels.issueDate}</Text>
            <Text>{invoice.issue_date}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>{labels.dueDate}</Text>
            <Text>{invoice.due_date}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>{labels.invoiceNumber}</Text>
            <Text>{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, styles.cellDescription]}>{labels.description}</Text>
            <Text style={[styles.cellHeader, styles.cellQty]}>{labels.qty}</Text>
            <Text style={[styles.cellHeader, styles.cellPrice]}>{labels.price}</Text>
            <Text style={[styles.cellHeader, styles.cellTotal]}>{labels.total}</Text>
          </View>
          {items.map((it) => (
            <View key={it.id} style={styles.tableRow}>
              <Text style={styles.cellDescription}>{it.description}</Text>
              <Text style={styles.cellQty}>{Number(it.quantity)}</Text>
              <Text style={styles.cellPrice}>{fmt(Number(it.unit_price))}</Text>
              <Text style={styles.cellTotal}>{fmt(Number(it.total))}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>{labels.subtotal}</Text>
            <Text style={styles.totalsValue}>{fmt(Number(invoice.subtotal))}</Text>
          </View>
          {Number(invoice.discount_amount) > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>
                {labels.discount} ({Number(invoice.discount_rate)}%)
              </Text>
              <Text style={styles.totalsValue}>-{fmt(Number(invoice.discount_amount))}</Text>
            </View>
          )}
          {Number(invoice.tax_amount) > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>
                {labels.tax} ({Number(invoice.tax_rate)}%)
              </Text>
              <Text style={styles.totalsValue}>{fmt(Number(invoice.tax_amount))}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandLabel}>{labels.grandTotal}</Text>
            <Text style={styles.grandValue}>{fmt(Number(invoice.total))}</Text>
          </View>
        </View>

        {/* Notes / terms */}
        {(invoice.notes || invoice.payment_terms) && (
          <View style={styles.notes}>
            {invoice.payment_terms && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.label}>{labels.paymentTerms}</Text>
                <Text>{invoice.payment_terms}</Text>
              </View>
            )}
            {invoice.notes && (
              <View>
                <Text style={styles.label}>{labels.notes}</Text>
                <Text>{invoice.notes}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Generated with Freelora · freelora.app
        </Text>
      </Page>
    </Document>
  );
}
