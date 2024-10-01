import { buttonVariants } from '@/components/ui/button';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, } from '@react-pdf/renderer';
import { ShippingLabel } from './form/shipping-details';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import { OfferContext, useOfferContext } from '@/hooks/offer-hook';
import { OfferFormValues } from './form/offer-form';
import { addLineBreaks } from '@/lib/utils';



const styles = StyleSheet.create({
    page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },

    spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },

    titleContainer: { flexDirection: 'row', marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: 'center' },

    addressTitle: { fontSize: 11, fontStyle: 'bold' },

    invoice: { fontWeight: 'bold', fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: 'bold' },

    address: { fontWeight: 400, fontSize: 10 },

    theader: { marginTop: 20, fontSize: 10, fontStyle: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

    tbody2: { flex: 2, borderRightWidth: 1, }

});

const ShippingLabelPdf = ({ shippingDetails, offer }: Props) => {

    const InvoiceTitle = () => (
        <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
                <Text style={styles.reportTitle}>Shipping Label</Text>
            </View>
        </View>
    );


    const UserAddress = () => (
        <View style={{ maxWidth: 400 }}>
            <Text style={styles.addressTitle}>Bill from </Text>
            <Text style={styles.address}>
                {addLineBreaks(shippingDetails.fromAddress)}
            </Text>
        </View>

    );

    const AdminAddress = () => (
        <Fragment>
            <View style={{ maxWidth: 400 }}>
                <Text style={styles.addressTitle}>Bill to </Text>
                <Text style={styles.address}>
                    {shippingDetails.toAddress}
                </Text>
            </View>
        </Fragment>
    );

    const OfferDate = () => (
        <View style={{ maxWidth: 200, marginTop: 10 }}>
            <Text style={[styles.addressTitle, { fontWeight: "semibold" }]}>
                Offer Date:
                {dayjs().format('DD-MMM-YYYY')}</Text>
        </View>
    )


    const TableBody = () => (
        offer!.products.map((receipt, index) => (
            <Fragment key={receipt.id}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={[styles.tbody, styles.tbody2]}>
                        <Text >{index + 1}.</Text>
                    </View>
                    <View style={[styles.tbody]}>
                        <Text >{receipt.product_name}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{receipt.upc} </Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{receipt.quantity}</Text>
                    </View>
                </View>
            </Fragment>
        ))
    );

    const TableHead = () => (
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
            <View style={[styles.theader, styles.theader2]}>
                <Text >S No.</Text>
            </View>
            <View style={styles.theader}>
                <Text>Name</Text>
            </View>
            <View style={styles.theader}>
                <Text>UPC</Text>
            </View>
            <View style={styles.theader}>
                <Text>Quantity</Text>
            </View>
        </View>
    );

    const PackageWeight = () => (
        <View style={{ marginTop: 20 }}>
            <Text style={[styles.addressTitle, { fontWeight: 800, marginBottom: 2, fontSize: 10 }]}>Package Weight</Text>
            <Text style={styles.address}>{shippingDetails.weight} LBS</Text>
        </View>
    );

    const PackageDimentions = () => (
        <View style={{ marginTop: 20 }}>
            <Text style={[styles.addressTitle, { fontWeight: 800, marginBottom: 2, fontSize: 10 }]}>Package Dimentions</Text>
            <View style={[{ display: 'flex', flexDirection: 'row', gap: 5 }]}>
                <Text style={styles.address}>Length: {shippingDetails.dimensions.length} {shippingDetails.dimensions.mesurement}</Text>
                <Text style={styles.address}> Width: {shippingDetails.dimensions.width} {shippingDetails.dimensions.mesurement}</Text>
                <Text style={styles.address}> Height: {shippingDetails.dimensions.height} {shippingDetails.dimensions.mesurement}</Text>
            </View>
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceTitle />
                <View style={styles.titleContainer}>
                    <View style={styles.spaceBetween}>
                        <UserAddress />
                        <AdminAddress />
                    </View>
                </View>
                <OfferDate />
                <TableHead />
                <TableBody />
                <PackageWeight />
                <PackageDimentions />
                {/* 
                <TableTotal /> */}
            </Page>
        </Document>

    )
}


type Props = {
    shippingDetails: ShippingLabel;
    offer?: OfferFormValues;
}

export const DowloadButton = ({ shippingDetails }: Props) => {
    const { offer } = useOfferContext();
    return (<PDFDownloadLink className={buttonVariants({ variant: "default" })} document={<ShippingLabelPdf offer={offer} shippingDetails={shippingDetails} />} fileName="shipping-label.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Wait.' : 'Print')}
    </PDFDownloadLink>
    );

};