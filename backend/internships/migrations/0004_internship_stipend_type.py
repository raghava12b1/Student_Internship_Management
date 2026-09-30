from django.db import migrations, models


def set_existing_stipend_types(apps, schema_editor):
    Internship = apps.get_model("internships", "Internship")
    database = schema_editor.connection.alias

    Internship.objects.using(database).filter(
        stipend__gt=0
    ).update(stipend_type="STIPEND")

    Internship.objects.using(database).filter(
        stipend__isnull=True
    ).update(stipend_type="NO_STIPEND")

    Internship.objects.using(database).filter(
        stipend__lte=0
    ).update(stipend_type="NO_STIPEND")


class Migration(migrations.Migration):
    dependencies = [
        ("internships", "0003_company"),
    ]

    operations = [
        migrations.AddField(
            model_name="internship",
            name="stipend_type",
            field=models.CharField(
                choices=[
                    ("STIPEND", "Stipend"),
                    ("NO_STIPEND", "No Stipend"),
                    ("PAID_BY_STUDENT", "Paid By Student"),
                ],
                default="NO_STIPEND",
                max_length=20,
            ),
        ),
        migrations.RunPython(
            set_existing_stipend_types,
            migrations.RunPython.noop,
        ),
    ]
