"use client";

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
};

type Address = {
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
};

type Measurement = {
  id: string;
  itemName: string | null;
  height: string | null;
  chest: string | null;
  waist: string | null;
  hip: string | null;
  shoulder: string | null;
  armLength: string | null;
  bicep: string | null;
  wrist: string | null;
  thigh: string | null;
  knee: string | null;
  calf: string | null;
  ankle: string | null;
  neck: string | null;
  head: string | null;
  unit: string;
  notes: string | null;
};

function MeasurementValue({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | null;
  unit: string;
}) {
  if (!value) return null;

  return (
    <div className="border border-[#e2e8f0] bg-[#f8fafc] p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#475569]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[#17212b]">
        {value} {unit}
      </p>
    </div>
  );
}

export default function OrderCustomerDetails({
  customer,
  address,
  measurements,
}: {
  customer: Customer | null;
  address: Address | null;
  measurements: Measurement[];
}) {
  return (
    <div className="mt-8 space-y-8">
      {/* Customer */}
      <section className="border border-[#e2e8f0] bg-[#ffffff] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Customer
        </p>

        <h2 className="mt-3 font-serif text-2xl font-bold">
          CUSTOMER INFORMATION
        </h2>

        {customer ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                Name
              </p>

              <p className="mt-2 text-sm text-[#17212b]">
                {customer.firstName}{" "}
                {customer.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                Email
              </p>

              <p className="mt-2 text-sm text-[#17212b]">
                {customer.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                Phone
              </p>

              <p className="mt-2 text-sm text-[#17212b]">
                {customer.phone || "Not provided"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#475569]">
            Customer information unavailable.
          </p>
        )}
      </section>

      {/* Shipping Address */}
      <section className="border border-[#e2e8f0] bg-[#ffffff] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Shipping
        </p>

        <h2 className="mt-3 font-serif text-2xl font-bold">
          SHIPPING ADDRESS
        </h2>

        {address ? (
          <div className="mt-6 text-sm leading-7 text-[#d0c8bb]">
            <p className="font-semibold text-[#17212b]">
              {address.firstName}{" "}
              {address.lastName}
            </p>

            {address.company && (
              <p>{address.company}</p>
            )}

            <p>{address.address1}</p>

            {address.address2 && (
              <p>{address.address2}</p>
            )}

            <p>
              {address.city}
              {address.state
                ? `, ${address.state}`
                : ""}
              {" "}
              {address.postalCode}
            </p>

            <p>{address.country}</p>

            {address.phone && (
              <p className="mt-2">
                Phone: {address.phone}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#475569]">
            Shipping address unavailable.
          </p>
        )}
      </section>

      {/* Measurements */}
      {measurements.length > 0 && (
        <section className="border border-[#e2e8f0] bg-[#ffffff] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
            Automation Services
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold">
            CUSTOM MEASUREMENTS
          </h2>

          <div className="mt-6 space-y-8">
            {measurements.map(
              (measurement) => (
                <div
                  key={measurement.id}
                  className="border-t border-[#e2e8f0] pt-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#17212b]">
                      {measurement.itemName ||
                        "Custom Size"}
                    </h3>

                    <span className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                      Unit: {measurement.unit}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    <MeasurementValue
                      label="Height"
                      value={
                        measurement.height
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Chest"
                      value={
                        measurement.chest
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Waist"
                      value={
                        measurement.waist
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Hip"
                      value={measurement.hip}
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Shoulder"
                      value={
                        measurement.shoulder
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Arm Length"
                      value={
                        measurement.armLength
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Bicep"
                      value={
                        measurement.bicep
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Wrist"
                      value={
                        measurement.wrist
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Thigh"
                      value={
                        measurement.thigh
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Knee"
                      value={measurement.knee}
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Calf"
                      value={measurement.calf}
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Ankle"
                      value={
                        measurement.ankle
                      }
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Neck"
                      value={measurement.neck}
                      unit={measurement.unit}
                    />

                    <MeasurementValue
                      label="Head"
                      value={measurement.head}
                      unit={measurement.unit}
                    />
                  </div>

                  {measurement.notes && (
                    <div className="mt-5 border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#475569]">
                        Customer Notes
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#d0c8bb]">
                        {measurement.notes}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}