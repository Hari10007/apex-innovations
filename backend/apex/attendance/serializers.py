from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    check_in = serializers.SerializerMethodField()
    check_out = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ['id', 'date', 'check_in', 'check_out', 'working_time', 'employee']

    def get_check_in(self, obj):
        check_ins = obj.check_in_outs.filter(is_check_in=True).order_by('time')
        if check_ins.exists():
            return check_ins.first().time.strftime('%H:%M:%S')
        return None

    def get_check_out(self, obj):
        check_ins = obj.check_in_outs.filter(is_check_in=True).order_by('time')
        check_outs = obj.check_in_outs.filter(is_check_in=False).order_by('-time')
        if check_outs.exists() and (not check_ins.exists() or check_outs.first().time > check_ins.last().time):
            return check_outs.first().time.strftime('%H:%M:%S')
        return None